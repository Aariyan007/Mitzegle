import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { parseEmail } from '../lib/parseEmail.js';
import { createLimiter } from '../lib/rateLimit.js';
import { generateCode, hashCode, checkCode } from '../lib/otp.js';
import { sendOtp } from '../lib/mailer.js';
import User from '../models/User.js';
import Otp from '../models/Otp.js';

export const signToken = (user) =>
  jwt.sign({ sub: String(user._id) }, process.env.JWT_SECRET, { expiresIn: '7d' });
export const verifyToken = (t) => jwt.verify(t, process.env.JWT_SECRET);

const perEmail = createLimiter({ limit: 1, windowMs: 60_000 });
const perIp = createLimiter({ limit: 10, windowMs: 3_600_000 });
const verifyIp = createLimiter({ limit: 30, windowMs: 3_600_000 });

export const authRouter = Router();

authRouter.post('/request-otp', async (req, res) => {
  if (!perIp.hit(req.ip)) return res.status(429).json({ error: 'Too many requests' });
  const parsed = parseEmail(req.body?.email);
  // Same response either way: no email probing.
  if (parsed && perEmail.hit(parsed.email)) {
    try {
      const code = generateCode();
      await Otp.findOneAndUpdate(
        { email: parsed.email },
        { codeHash: await hashCode(code), attempts: 0, createdAt: new Date() },
        { upsert: true }
      );
      await sendOtp(parsed.email, code);
    } catch {
      console.error('otp send failed');
    }
  }
  res.json({ ok: true });
});

authRouter.post('/verify-otp', async (req, res) => {
  if (!verifyIp.hit(req.ip)) return res.status(429).json({ error: 'Too many requests' });
  const parsed = parseEmail(req.body?.email);
  const code = req.body?.code;
  const bad = () => res.status(400).json({ error: 'Invalid or expired code' });
  if (!parsed || typeof code !== 'string' || !/^\d{6}$/.test(code)) return bad();

  const otp = await Otp.findOne({ email: parsed.email });
  if (!otp) return bad();
  if (otp.attempts >= 5) {
    await otp.deleteOne();
    return bad();
  }
  if (!(await checkCode(code, otp.codeHash))) {
    otp.attempts += 1;
    await otp.save();
    return bad();
  }
  await otp.deleteOne();

  const { email, joinYear, branch, roll } = parsed;
  const user = await User.findOneAndUpdate(
    { email },
    { $setOnInsert: { email, joinYear, branch, roll } },
    { upsert: true, new: true }
  );
  if (user.banned) return res.status(403).json({ error: 'Account blocked' });
  res.json({ token: signToken(user) });
});
