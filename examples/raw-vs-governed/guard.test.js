const { test } = require('node:test');
const assert = require('node:assert/strict');
const { guardedExecute } = require('./guard');
const permit = { packet_id: 'p', public_release: true, outcome: 'stable', admissible: true, recommended_action: 'allow' };
for (const [name, receipt] of Object.entries({ blocked: { ...permit, outcome: 'blocked', admissible: false, recommended_action: 'deny' },
  escalated: { ...permit, outcome: 'unstable', recommended_action: 'escalate' },
  constrained: { ...permit, outcome: 'degraded', recommended_action: 'constrain' },
  mismatched: { ...permit, packet_id: 'other' }, malformed: {}, nonreference: { ...permit, public_release: false } })) {
  test(`${name} never invokes executor`, async () => {
    let calls = 0;
    const result = await guardedExecute({ baseUrl: 'http://demo', packet: { packet_id: 'p' },
      fetchImpl: async () => ({ ok: true, json: async () => receipt }), execute: async () => calls++ });
    assert.equal(result.executed, false); assert.equal(calls, 0);
  });
}
for (const [name, fetchImpl] of Object.entries({ unavailable: async () => { throw new Error('timeout'); },
  httpError: async () => ({ ok: false, status: 503 }), invalidJson: async () => ({ ok: true, json: async () => { throw new Error('invalid JSON'); } }) })) {
  test(`${name} fails closed`, async () => {
    let calls = 0;
    const result = await guardedExecute({ baseUrl: 'http://demo', packet: { packet_id: 'p' }, fetchImpl, execute: async () => calls++ });
    assert.equal(result.executed, false); assert.equal(calls, 0);
  });
}
test('explicit reference allow executes once', async () => {
  let calls = 0;
  const result = await guardedExecute({ baseUrl: 'http://demo', packet: { packet_id: 'p' },
    fetchImpl: async () => ({ ok: true, json: async () => permit }), execute: async () => ++calls });
  assert.equal(result.executed, true); assert.equal(calls, 1);
});
