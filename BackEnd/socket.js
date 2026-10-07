import { createMatcher } from './lib/matcher.js';
import { createLimiter } from './lib/rateLimit.js';
import { verifyToken } from './routes/auth.js';
import User from './models/User.js';

export function attachSocket(io) {
  const matcher = createMatcher();
  const sockets = new Map(); // userId -> socket
  const events = createLimiter({ limit: 20, windowMs: 10_000 });

  io.use(async (socket, next) => {
    try {
      const { sub } = verifyToken(socket.handshake.auth?.token);
      const user = await User.findById(sub).select('banned');
      if (!user || user.banned) return next(new Error('forbidden'));
      socket.data.userId = sub;
      next();
    } catch {
      next(new Error('unauthorized'));
    }
  });

  function leave(userId) {
    const partner = matcher.remove(userId);
    if (partner) sockets.get(partner)?.emit('PartnerLeft');
  }

  io.on('connection', (socket) => {
    const userId = socket.data.userId;
    const old = sockets.get(userId);
    if (old && old.id !== socket.id) {
      leave(userId);
      old.emit('kicked');
      old.disconnect(true);
    }
    sockets.set(userId, socket);

    const guard = (fn) => () => {
      if (!events.hit(userId)) return;
      fn();
    };

    const start = () => {
      const r = matcher.enqueue(userId);
      if (r.status === 'matched') {
        socket.emit('Matched', { roomId: r.roomId });
        sockets.get(r.partner)?.emit('Matched', { roomId: r.roomId });
      }
    };

    socket.on('start', guard(start));
    socket.on('skip', guard(() => { leave(userId); start(); }));
    socket.on('leave', guard(() => leave(userId)));
    socket.on('disconnect', () => {
      if (sockets.get(userId) === socket) {
        leave(userId);
        sockets.delete(userId);
      }
    });
  });

  return { isPairedIn: matcher.isPairedIn };
}
