import test from 'node:test';
import assert from 'node:assert/strict';
import { createDecipheriv } from 'node:crypto';
import { makeZegoToken } from '../lib/zegoToken.js';

const SECRET = 'a'.repeat(32);

test('token04 round trip', () => {
  process.env.ZEGO_APP_ID = '12345';
  process.env.ZEGO_SERVER_SECRET = SECRET;
  const token = makeZegoToken('user1', 'roomX');
  assert.ok(token.startsWith('04'));
  const buf = Buffer.from(token.slice(2), 'base64');
  const expire = Number(buf.readBigInt64BE(0));
  const ivLen = buf.readUInt16BE(8);
  const iv = buf.subarray(10, 10 + ivLen);
  const encLen = buf.readUInt16BE(10 + ivLen);
  const enc = buf.subarray(12 + ivLen, 12 + ivLen + encLen);
  const d = createDecipheriv('aes-256-cbc', SECRET, iv);
  const json = JSON.parse(Buffer.concat([d.update(enc), d.final()]).toString());
  assert.equal(json.app_id, 12345);
  assert.equal(json.user_id, 'user1');
  assert.equal(json.expire, expire);
  assert.equal(JSON.parse(json.payload).room_id, 'roomX');
  assert.ok(expire - json.ctime === 3600);
});
