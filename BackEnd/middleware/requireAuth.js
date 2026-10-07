import { verifyToken } from '../routes/auth.js';
import User from '../models/User.js';

export async function requireAuth(req, res, next) {
  try {
    const raw = req.headers.authorization?.replace(/^Bearer /, '');
    const { sub } = verifyToken(raw);
    const user = await User.findById(sub).select('banned');
    if (!user || user.banned) return res.status(403).json({ error: 'Forbidden' });
    req.userId = sub;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
