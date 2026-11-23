import test from 'node:test';
import assert from 'node:assert/strict';
import { processFeed, maskAccount, parseCsv, toCsv } from '../src/pipeline.ts';

const header = 'record_id,customer_reference,account_number,status\n';
const entry = 'R001,CUST-001,1111222233334444,ACTIVE\n';

test('masks all but the final four digits', () => {
  assert.equal(maskAccount('1111222233334444'), '************4444');
});
test('processes valid feed with deterministic audit', () => {
  const { output, audit } = processFeed(header + entry + 'R002,CUST-002,5555666677778888,PENDING\n');
  assert.match(output, /\*{12}4444,ACTIVE/);
  assert.equal(audit.processed, 2);
  assert.deepEqual(audit.status_counts, {ACTIVE: 1, INACTIVE: 0, PENDING: 1});
  assert.doesNotMatch(output, /1111222233334444/);
});
test('rejects duplicates before returning output', () => {
  assert.throws(() => processFeed(header + entry + entry), /duplicate record_id/);
});
test('rejects malformed account number', () => {
  assert.throws(() => processFeed(header + 'R001,CUST-001,abc,ACTIVE\n'), /12–19 digits/);
});
test('rejects unsupported status', () => {
  assert.throws(() => processFeed(header + 'R001,CUST-001,1111222233334444,SUSPENDED\n'), /unsupported status/);
});
test('rejects incomplete CSV records', () => {
  assert.throws(() => processFeed(header + 'R001,CUST-001,1111222233334444\n'), /expected 4 columns/);
});
test('handles quoted commas and escaped quotes', () => {
  const source = header + 'R001,"Acme, ""Test""",1111222233334444,ACTIVE\n';
  const result = processFeed(source);
  assert.deepEqual(parseCsv(result.output)[1], ['R001', 'Acme, "Test"', '************4444', 'ACTIVE']);
  assert.equal(parseCsv(toCsv([['a,b', 'a"b']]))[0][1], 'a"b');
});
test('rejects unclosed quotes', () => {
  assert.throws(() => processFeed(header + 'R001,"oops\n'), /Unclosed CSV quote/);
});
test('rejects duplicate header names', () => {
  assert.throws(() => processFeed('record_id,record_id,account_number,status\n' + entry), /Expected CSV header/);
});
