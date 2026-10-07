import test from 'node:test';
import assert from 'node:assert/strict';
import { createMatcher } from '../lib/matcher.js';

const mk = () => { let n = 0; return createMatcher(() => `room${++n}`); };

test('first waits, second matches', () => {
  const m = mk();
  assert.deepEqual(m.enqueue('a'), { status: 'waiting' });
  assert.deepEqual(m.enqueue('b'), { status: 'matched', partner: 'a', roomId: 'room1' });
  assert.equal(m.partnerOf('a'), 'b');
  assert.ok(m.isPairedIn('b', 'room1'));
  assert.ok(!m.isPairedIn('c', 'room1'));
});
test('double start ignored, never self-match', () => {
  const m = mk();
  m.enqueue('a');
  assert.deepEqual(m.enqueue('a'), { status: 'ignored' });
  m.enqueue('b');
  assert.deepEqual(m.enqueue('b'), { status: 'ignored' });
});
test('remove from queue', () => {
  const m = mk();
  m.enqueue('a');
  assert.equal(m.remove('a'), null);
  assert.deepEqual(m.enqueue('b'), { status: 'waiting' });
});
test('remove paired returns partner and frees both', () => {
  const m = mk();
  m.enqueue('a'); m.enqueue('b');
  assert.equal(m.remove('a'), 'b');
  assert.equal(m.partnerOf('b'), null);
  assert.deepEqual(m.enqueue('b'), { status: 'waiting' });
});
test('remove unknown is safe', () => {
  assert.equal(mk().remove('zzz'), null);
});
