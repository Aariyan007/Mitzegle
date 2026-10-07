import test from 'node:test';
import assert from 'node:assert/strict';
import { generateCode, hashCode, checkCode } from '../lib/otp.js';

test('code is 6 digits', () => {
  for (let i = 0; i < 50; i++) assert.match(generateCode(), /^\d{6}$/);
});
test('hash round trip', async () => {
  const h = await hashCode('012345');
  assert.ok(await checkCode('012345', h));
  assert.ok(!(await checkCode('012346', h)));
});
