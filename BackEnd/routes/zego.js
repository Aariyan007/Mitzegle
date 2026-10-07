import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { makeZegoToken } from '../lib/zegoToken.js';

export function zegoRouter(isPairedIn) {
  const r = Router();
  r.get('/zego-token', requireAuth, (req, res) => {
    const roomId = req.query.roomId;
    if (typeof roomId !== 'string' || !isPairedIn(req.userId, roomId)) {
      return res.status(403).json({ error: 'Not in this room' });
    }
    res.json({ token: makeZegoToken(req.userId, roomId), appId: Number(process.env.ZEGO_APP_ID) });
  });
  return r;
}
