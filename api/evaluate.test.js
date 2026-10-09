const { test } = require('node:test');
const assert = require('node:assert/strict');
const { evaluateHarmonicStabilizer } = require('./evaluate');

function basePacket() {
  return {
    packet_id: 'regression-packet',
    requested_action: 'release_document',
    execution_request: { action: 'release_document', scope: 'nda-document-release', arguments: { document_id: 'd1' } },
    truth: {
      claims: ['Release is authorized under the represented current authority.'],
      observations: [{ statement: 'Current evidence remains verified and consistent.' }],
      evidence: [{ ref: 'test://evidence/1' }],
      last_verified_at: new Date().toISOString(),
      stale_after_minutes: 5,
    },
    authority: {
      responsible_actor: 'agent-1', basis: 'authority-registry', consequence_owner: 'owner-1',
      revoked: false, expires_at: '2090-01-01T00:00:00Z', scope: 'nda-document-release',
    },
    compassion: { affected_parties: ['owner'], potential_harms: [], mitigations: [], escalation_path: 'reviewer' },
    accountability: { responsible_actor: 'agent-1', authority_basis: 'authority-registry', consequence_owner: 'owner-1', audit_ref: 'a1', rollback_plan: 'hold-before-effect' },
  };
}

test('explicit revocation cannot coexist with stable/allow', () => {
  const packet = basePacket(); packet.authority.revoked = true;
  const result = evaluateHarmonicStabilizer(packet);
  assert.equal(result.outcome, 'blocked');
  assert.equal(result.admissible, false);
  assert.equal(result.recommended_action, 'deny');
  assert.equal(result.runtime_continuity.authority_risk.revoked, true);
});

test('expired authority cannot coexist with stable/allow', () => {
  const packet = basePacket(); packet.authority.expires_at = '2001-01-01T00:00:00Z';
  const result = evaluateHarmonicStabilizer(packet);
  assert.equal(result.outcome, 'blocked');
  assert.equal(result.recommended_action, 'deny');
});

test('scope mismatch cannot coexist with stable/allow', () => {
  const packet = basePacket(); packet.authority.scope = 'invoice-read-only';
  const result = evaluateHarmonicStabilizer(packet);
  assert.equal(result.outcome, 'blocked');
  assert.equal(result.recommended_action, 'deny');
});

test('required freshness with missing verification time fails closed', () => {
  const packet = basePacket(); delete packet.truth.last_verified_at;
  const result = evaluateHarmonicStabilizer(packet);
  assert.equal(result.outcome, 'blocked');
  assert.equal(result.recommended_action, 'deny');
});

test('materially future-dated verification time fails closed', () => {
  const packet = basePacket(); packet.truth.last_verified_at = '2099-01-01T00:00:00Z';
  const result = evaluateHarmonicStabilizer(packet);
  assert.equal(result.outcome, 'blocked');
  assert.equal(result.recommended_action, 'deny');
});

test('current in-scope authority can still return stable/allow', () => {
  const result = evaluateHarmonicStabilizer(basePacket());
  assert.equal(result.outcome, 'stable');
  assert.equal(result.admissible, true);
  assert.equal(result.recommended_action, 'allow');
  assert.equal(result.runtime_continuity.survivability, 'surviving');
  assert.match(result.reference_binding.request_hash, /^[a-f0-9]{64}$/);
  assert.match(result.reference_binding.operation_hash, /^[a-f0-9]{64}$/);
});


test('empty preferred observation lane cannot shadow contradictory observed-state revocation signal', () => {
  const packet = basePacket();
  packet.truth.observations = [];
  packet.observed_state = { signals: [{ statement: 'Authorization revoked before consequence.' }] };
  const result = evaluateHarmonicStabilizer(packet);
  assert.equal(result.outcome, 'blocked');
  assert.equal(result.recommended_action, 'deny');
});

test('present authority object cannot shadow revocation represented in accountability', () => {
  const packet = basePacket();
  packet.accountability.revoked = true;
  const result = evaluateHarmonicStabilizer(packet);
  assert.equal(result.outcome, 'blocked');
  assert.equal(result.recommended_action, 'deny');
  assert.equal(result.runtime_continuity.authority_risk.revoked, true);
});

test('generic future expiry cannot shadow an expired mandate expiry', () => {
  const packet = basePacket();
  packet.authority.expires_at = '2090-01-01T00:00:00Z';
  packet.authority.mandate_expires_at = '2001-01-01T00:00:00Z';
  const result = evaluateHarmonicStabilizer(packet);
  assert.equal(result.outcome, 'blocked');
  assert.equal(result.recommended_action, 'deny');
  assert.equal(result.runtime_continuity.authority_risk.expired, true);
});

test('non-conflicting duplicate authority representations preserve stable allow control', () => {
  const packet = basePacket();
  packet.accountability.revoked = false;
  packet.accountability.expires_at = '2090-01-01T00:00:00Z';
  packet.accountability.scope = 'nda-document-release';
  const result = evaluateHarmonicStabilizer(packet);
  assert.equal(result.outcome, 'stable');
  assert.equal(result.admissible, true);
  assert.equal(result.recommended_action, 'allow');
});
