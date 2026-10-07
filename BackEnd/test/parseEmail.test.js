import test from 'node:test';
import assert from 'node:assert/strict';
import { parseEmail } from '../lib/parseEmail.js';

test('parses valid email', () => {
  assert.deepEqual(parseEmail('23cs293@mgits.ac.in'),
    { email: '23cs293@mgits.ac.in', joinYear: 2023, branch: 'cs', roll: '293' });
});
test('normalises case and spaces', () => {
  assert.equal(parseEmail('  23CS293@MGITS.AC.IN ').email, '23cs293@mgits.ac.in');
});
test('rejects other domains', () => {
  assert.equal(parseEmail('23cs293@gmail.com'), null);
  assert.equal(parseEmail('23cs293@mgits.ac.in.evil.com'), null);
});
test('rejects non-strings (NoSQL injection)', () => {
  assert.equal(parseEmail({ $ne: '' }), null);
  assert.equal(parseEmail(['23cs293@mgits.ac.in']), null);
  assert.equal(parseEmail(undefined), null);
});
test('rejects bad shape', () => {
  assert.equal(parseEmail('cs293@mgits.ac.in'), null);
  assert.equal(parseEmail('23cs29@mgits.ac.in'), null);
});
