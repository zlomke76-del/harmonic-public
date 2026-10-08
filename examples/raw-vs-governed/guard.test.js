const { test } = require('node:test');
const assert = require('node:assert/strict');
const { guardedExecute, verifyReferenceReceiptBinding, sha256, stableStringify } = require('./guard');

function packet() {
  return {
    packet_id: 'p',
    requested_action: 'release_document',
    execution_request: { action: 'release_document', arguments: { document_id: 'd1' } },
  };
}

function permitFor(p) {
  const receipt = {
    packet_id: p.packet_id,
    public_release: true,
    outcome: 'stable',
    admissible: true,
    recommended_action: 'allow',
    runtime_continuity: { survivability: 'surviving', admissibility_window: 'open', escalation_required: false },
    reference_binding: {
      request_hash: sha256(stableStringify(p)),
      operation_hash: sha256(stableStringify(p.execution_request)),
      valid_until: new Date(Date.now() + 30_000).toISOString(),
    },
    artifact_hash: 'a'.repeat(64),
  };
  return receipt;
}

const passthroughRefresh = async (p) => structuredClone(p);
const referenceVerify = async ({ packet, receipt }) => verifyReferenceReceiptBinding({ packet, receipt });

for (const [name, mutate] of Object.entries({
  blocked: (r) => Object.assign(r, { outcome: 'blocked', admissible: false, recommended_action: 'deny' }),
  escalated: (r) => Object.assign(r, { outcome: 'unstable', admissible: false, recommended_action: 'escalate' }),
  constrained: (r) => Object.assign(r, { outcome: 'degraded', recommended_action: 'constrain' }),
  mismatched: (r) => { r.packet_id = 'other'; },
  malformed: (r) => { for (const k of Object.keys(r)) delete r[k]; },
  nonreference: (r) => { r.public_release = false; },
  failedContinuity: (r) => { r.runtime_continuity = { survivability: 'failed', admissibility_window: 'closed', escalation_required: true }; },
  missingBinding: (r) => { delete r.reference_binding; },
  expiredBinding: (r) => { r.reference_binding.valid_until = '2001-01-01T00:00:00Z'; },
})) {
  test(`${name} never invokes executor`, async () => {
    let calls = 0;
    const p = packet(); const receipt = permitFor(p); mutate(receipt);
    const result = await guardedExecute({ baseUrl: 'http://demo', packet: p,
      refreshCurrentPacket: passthroughRefresh, verifyReceipt: referenceVerify,
      fetchImpl: async () => ({ ok: true, json: async () => receipt }), execute: async () => calls++ });
    assert.equal(result.executed, false); assert.equal(calls, 0);
  });
}

for (const [name, fetchImpl] of Object.entries({
  unavailable: async () => { throw new Error('timeout'); },
  httpError: async () => ({ ok: false, status: 503 }),
  invalidJson: async () => ({ ok: true, json: async () => { throw new Error('invalid JSON'); } }),
})) {
  test(`${name} fails closed`, async () => {
    let calls = 0;
    const result = await guardedExecute({ baseUrl: 'http://demo', packet: packet(),
      refreshCurrentPacket: passthroughRefresh, verifyReceipt: referenceVerify,
      fetchImpl, execute: async () => calls++ });
    assert.equal(result.executed, false); assert.equal(calls, 0);
  });
}

test('missing revalidation function fails closed', async () => {
  let calls = 0;
  const result = await guardedExecute({ baseUrl: 'http://demo', packet: packet(), verifyReceipt: referenceVerify,
    fetchImpl: async () => ({ ok: true, json: async () => permitFor(packet()) }), execute: async () => calls++ });
  assert.equal(result.executed, false); assert.match(result.error, /revalidation/i); assert.equal(calls, 0);
});

test('missing receipt verifier fails closed', async () => {
  let calls = 0;
  const result = await guardedExecute({ baseUrl: 'http://demo', packet: packet(), refreshCurrentPacket: passthroughRefresh,
    fetchImpl: async () => ({ ok: true, json: async () => permitFor(packet()) }), execute: async () => calls++ });
  assert.equal(result.executed, false); assert.match(result.error, /receipt verification/i); assert.equal(calls, 0);
});

test('effect-time revalidation change forces a second evaluation and blocks changed authority', async () => {
  let calls = 0; let refreshes = 0; let evaluations = 0;
  const initial = packet();
  const changed = { ...initial, authority: { revoked: true } };
  const result = await guardedExecute({
    baseUrl: 'http://demo', packet: initial,
    refreshCurrentPacket: async (p) => (++refreshes === 1 ? structuredClone(p) : structuredClone(changed)),
    verifyReceipt: referenceVerify,
    fetchImpl: async (_url, options) => {
      evaluations++;
      const sent = JSON.parse(options.body);
      const r = permitFor(sent);
      if (sent.authority?.revoked) Object.assign(r, { outcome: 'blocked', admissible: false, recommended_action: 'deny', runtime_continuity: { survivability: 'failed', admissibility_window: 'closed', escalation_required: true } });
      return { ok: true, json: async () => r };
    },
    execute: async () => calls++,
  });
  assert.equal(result.executed, false); assert.equal(calls, 0); assert.equal(evaluations, 2);
});

test('explicit reference allow executes once after revalidation and binding verification', async () => {
  let calls = 0;
  const p = packet();
  const result = await guardedExecute({ baseUrl: 'http://demo', packet: p,
    refreshCurrentPacket: passthroughRefresh, verifyReceipt: referenceVerify,
    fetchImpl: async (_url, options) => { const sent = JSON.parse(options.body); return { ok: true, json: async () => permitFor(sent) }; },
    execute: async () => ++calls });
  assert.equal(result.executed, true); assert.equal(calls, 1);
});
