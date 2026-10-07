import { randomUUID } from 'node:crypto';

export function createMatcher(makeRoomId = randomUUID) {
  const waiting = [];
  const pairs = new Map(); // id -> { partner, roomId }

  function enqueue(id) {
    if (waiting.includes(id) || pairs.has(id)) return { status: 'ignored' };
    const partner = waiting.shift();
    if (!partner) {
      waiting.push(id);
      return { status: 'waiting' };
    }
    const roomId = makeRoomId();
    pairs.set(id, { partner, roomId });
    pairs.set(partner, { partner: id, roomId });
    return { status: 'matched', partner, roomId };
  }

  function remove(id) {
    const i = waiting.indexOf(id);
    if (i !== -1) waiting.splice(i, 1);
    const p = pairs.get(id);
    if (!p) return null;
    pairs.delete(id);
    pairs.delete(p.partner);
    return p.partner;
  }

  const partnerOf = (id) => pairs.get(id)?.partner ?? null;
  const roomOf = (id) => pairs.get(id)?.roomId ?? null;
  const isPairedIn = (id, roomId) => pairs.get(id)?.roomId === roomId;

  return { enqueue, remove, partnerOf, roomOf, isPairedIn };
}
