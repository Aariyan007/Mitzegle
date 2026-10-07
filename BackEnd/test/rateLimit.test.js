import test from 'node:test';
import assert from 'node:assert/strict';
import { createLimiter } from '../lib/rateLimit.js';

test('blocks after limit, frees after window', () => {
  let t = 0;
  const l = createLimiter({ limit: 2, windowMs: 1000, now: () => t });
  assert.ok(l.hit('k')); assert.ok(l.hit('k'));
  assert.ok(!l.hit('k'));
  assert.ok(l.hit('other'));
  t = 1001;
  assert.ok(l.hit('k'));
});
