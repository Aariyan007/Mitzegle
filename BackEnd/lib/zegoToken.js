import { createCipheriv, randomBytes, randomInt } from 'node:crypto';

const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const randomIv = () => Array.from({ length: 16 }, () => CHARS[randomInt(CHARS.length)]).join('');

// Zego "token04": AES-CBC encrypted JSON, see Zego server token docs.
export function makeZegoToken(userId, roomId, ttlSeconds = 3600) {
  const secret = process.env.ZEGO_SERVER_SECRET;
  const ctime = Math.floor(Date.now() / 1000);
  const expire = ctime + ttlSeconds;
  const body = JSON.stringify({
    app_id: Number(process.env.ZEGO_APP_ID),
    user_id: userId,
    nonce: randomBytes(4).readInt32BE(),
    ctime,
    expire,
    payload: JSON.stringify({
      room_id: roomId,
      privilege: { 1: 1, 2: 1 },
      stream_id_list: null,
    }),
  });
  const iv = randomIv();
  const cipher = createCipheriv('aes-256-cbc', secret, iv);
  const enc = Buffer.concat([cipher.update(body), cipher.final()]);

  const head = Buffer.alloc(8);
  head.writeBigInt64BE(BigInt(expire));
  const ivLen = Buffer.alloc(2); ivLen.writeUInt16BE(iv.length);
  const encLen = Buffer.alloc(2); encLen.writeUInt16BE(enc.length);
  return '04' + Buffer.concat([head, ivLen, Buffer.from(iv), encLen, enc]).toString('base64');
}
