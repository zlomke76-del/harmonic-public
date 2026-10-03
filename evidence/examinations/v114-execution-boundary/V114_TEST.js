const assert = require('assert');
const crypto = require('crypto');
const {
  RECEIPT_HEADER,
  computeHash,
  encodeReceiptHeader,
  performSecureExecution,
  signReceipt,
  verifyExecutorRequest,
} = require('../api/secure-execution');

/*
V114 — Execution-Boundary Falsification

Frozen property:
  Within the constituted executor boundary, the governed consequence is causally
  dependent on a current Harmonic execution permit. No request reaching that
  boundary may produce the consequence unless the exact execute payload is bound
  to a valid, current Harmonic receipt.

Falsifier:
  Any bypass/forgery/tamper/stale/denied path produces the governed consequence.

Important scope:
  This test establishes the property only for the constituted executor boundary
  exercised here. It does not claim that every possible infrastructure path in a
  deployment has been enumerated. Deployment-level exclusivity requires an
  architecture-specific inventory of all effect-capable paths.
*/

function keypair() {
  return crypto.generateKeyPairSync('ed25519', {
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
}

const { publicKey: publicKeyPem, privateKey: privateKeyPem } = keypair();
process.env.HARMONIC_SECURE_EXECUTION_PRIVATE_KEY_PEM = privateKeyPem;
process.env.HARMONIC_SECURE_EXECUTION_PUBLIC_KEY_PEM = publicKeyPem;
process.env.HARMONIC_SECURE_EXECUTION_TARGETS_JSON = JSON.stringify({
  payments: { url: 'https://constituted-executor.invalid/execute' },
});
process.env.HARMONIC_SECURE_EXECUTION_PERSISTENCE_REQUIRED = 'false';

const governancePermit = {
  runtime_version: '4.1.0',
  outcome: 'PERMITTED',
  admissible: true,
  action: 'allow',
  artifact_hash: 'v114-governance-artifact',
  execution_boundary: { should_execute: true, reason: 'V114 positive control.' },
};
const governanceDeny = {
  ...governancePermit,
  outcome: 'REFUSED',
  admissible: false,
  action: 'refuse',
  execution_boundary: { should_execute: false, reason: 'V114 standing defeated.' },
};
const evidenceRecord = {
  determination: { determination_id: 'v114-det', determination_hash: 'v114-det-hash' },
  receipt: { receipt_id: 'v114-gov-rec', receipt_hash: 'v114-gov-rec-hash' },
};
const authContext = {
  client_id: '00000000-0000-0000-0000-000000000001',
  application_id: '00000000-0000-0000-0000-000000000002',
  tenant_id: null,
  api_key_id: '00000000-0000-0000-0000-000000000003',
  application: { secure_execution_service_code: 'payments' },
};
const execute = {
  action: 'payments:refund',
  transaction_id: 'v114-tx',
  amount: 250,
  currency: 'USD',
};
function packet(overrides = {}) {
  return {
    packet_id: 'v114-packet',
    requested_action: { type: 'payments:refund' },
    secure_execution: {
      requested: true,
      service: 'payments',
      idempotency_key: 'v114-idempotency',
      intent: { actor: { id: 'v114-actor' }, intent: 'issue_refund' },
      execute: { ...execute },
      policy_state: { policy_version: 'v114' },
      ...overrides,
    },
  };
}

// The synthetic executor is the constituted consequence boundary.  The effect
// counter is incremented only after executor-side receipt verification succeeds.
let effectCount = 0;
async function constitutedExecutor(_url, options = {}) {
  const headers = options.headers || {};
  const body = JSON.parse(options.body || '{}');
  const check = verifyExecutorRequest({
    receiptHeader: headers[RECEIPT_HEADER] || headers['x-solace-receipt'],
    receiptPublicKeyPem: publicKeyPem,
    expectedService: 'payments',
    execute: body.execute,
  });
  if (!check.ok) {
    return new Response(JSON.stringify({ accepted: false, reason: check.reason }), {
      status: 403,
      headers: { 'content-type': 'application/json' },
    });
  }
  effectCount += 1;
  return new Response(JSON.stringify({ accepted: true, effect_id: `effect-${effectCount}` }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

async function externalAttempt({ receiptHeader, attemptedExecute = execute }) {
  return constitutedExecutor('https://constituted-executor.invalid/execute', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(receiptHeader ? { [RECEIPT_HEADER]: receiptHeader } : {}),
    },
    body: JSON.stringify({ execute: attemptedExecute }),
  });
}

function forgedReceipt({ executePayload = execute, issuedAt, expiresAt } = {}) {
  const now = Date.now();
  const unsigned = {
    version: '1.0.0',
    receipt_id: 'forged-v114',
    nonce: 'forged',
    issuer: 'attacker',
    service: 'payments',
    action: 'payments:refund',
    execute_hash: computeHash(executePayload),
    decision: 'PERMIT',
    issued_at: issuedAt || new Date(now - 1000).toISOString(),
    expires_at: expiresAt || new Date(now + 30000).toISOString(),
  };
  const attacker = keypair();
  return encodeReceiptHeader(signReceipt(unsigned, attacker.privateKey));
}

(async () => {
  const results = [];
  const record = (name, passed, detail) => results.push({ name, passed, detail });

  // NEGATIVE 1: direct external call, no Harmonic receipt.
  let before = effectCount;
  let r = await externalAttempt({});
  assert.strictEqual(r.status, 403);
  assert.strictEqual(effectCount, before, 'FALSIFIER TRIGGERED: receiptless bypass produced consequence');
  record('receiptless_direct_bypass', true, 'blocked; no consequence');

  // NEGATIVE 2: attacker-signed fake PERMIT.
  before = effectCount;
  r = await externalAttempt({ receiptHeader: forgedReceipt() });
  assert.strictEqual(r.status, 403);
  assert.strictEqual(effectCount, before, 'FALSIFIER TRIGGERED: forged receipt produced consequence');
  record('forged_permit', true, 'blocked; no consequence');

  // POSITIVE CONTROL: current permitting Harmonic determination reaches executor.
  before = effectCount;
  const permitted = await performSecureExecution({
    packet: packet(), governanceResult: governancePermit, evidenceRecord, authContext, fetchImpl: constitutedExecutor,
  });
  assert.strictEqual(permitted.status, 'EXECUTED');
  assert.strictEqual(permitted.executed, true);
  assert.strictEqual(effectCount, before + 1, 'positive control failed: valid governed execution produced no consequence');
  record('valid_current_permit_positive_control', true, 'exactly one consequence');

  // NEGATIVE 3: tamper payload after a valid receipt was minted.
  const dry = await performSecureExecution({
    packet: packet({ dry_run: true }), governanceResult: governancePermit, evidenceRecord, authContext,
  });
  assert.strictEqual(dry.status, 'BOUND_NOT_FORWARDED');
  before = effectCount;
  r = await externalAttempt({
    receiptHeader: dry.receipt_header,
    attemptedExecute: { ...execute, amount: 999 },
  });
  assert.strictEqual(r.status, 403);
  assert.strictEqual(effectCount, before, 'FALSIFIER TRIGGERED: payload tamper produced consequence');
  record('payload_tamper_after_permit', true, 'blocked; no consequence');

  // NEGATIVE 4: expired otherwise correctly signed receipt.
  const now = Date.now();
  const expiredUnsigned = {
    ...dry.receipt,
    receipt_id: 'expired-v114',
    issued_at: new Date(now - 120000).toISOString(),
    expires_at: new Date(now - 60000).toISOString(),
  };
  delete expiredUnsigned.signature;
  const expired = signReceipt(expiredUnsigned, privateKeyPem);
  before = effectCount;
  r = await externalAttempt({ receiptHeader: encodeReceiptHeader(expired) });
  assert.strictEqual(r.status, 403);
  assert.strictEqual(effectCount, before, 'FALSIFIER TRIGGERED: expired permit produced consequence');
  record('expired_permit', true, 'blocked; no consequence');

  // NEGATIVE 5: governance itself refuses. No execution receipt may be minted or forwarded.
  before = effectCount;
  const denied = await performSecureExecution({
    packet: packet(), governanceResult: governanceDeny, evidenceRecord, authContext, fetchImpl: constitutedExecutor,
  });
  assert.strictEqual(denied.status, 'DENIED_BY_GOVERNANCE');
  assert.strictEqual(denied.executed, false);
  assert.strictEqual(denied.receipt, undefined);
  assert.strictEqual(effectCount, before, 'FALSIFIER TRIGGERED: refused governance produced consequence');
  record('governance_refusal', true, 'no receipt; no consequence');

  // NEGATIVE 6: missing persisted governance evidence fails closed before execution.
  before = effectCount;
  const noEvidence = await performSecureExecution({
    packet: packet(), governanceResult: governancePermit, evidenceRecord: {}, authContext, fetchImpl: constitutedExecutor,
  });
  assert.strictEqual(noEvidence.status, 'FAILED_CLOSED');
  assert.strictEqual(noEvidence.reason, 'governance_evidence_not_persisted');
  assert.strictEqual(effectCount, before, 'FALSIFIER TRIGGERED: unpersisted governance produced consequence');
  record('missing_governance_evidence', true, 'failed closed; no consequence');

  console.log(JSON.stringify({
    examination: 'V114_EXECUTION_BOUNDARY_FALSIFICATION',
    frozen_property: 'Within the constituted executor boundary, consequence requires a current valid Harmonic execution permit bound to the exact payload.',
    falsifier: 'Any bypass, forgery, tamper, stale permit, governance refusal, or missing governance evidence produces the governed consequence.',
    result: 'SUPPORTED_FOR_EXAMINED_BOUNDARY',
    falsifier_triggered: false,
    final_effect_count: effectCount,
    expected_effect_count: 1,
    cases: results,
    nonclaim: 'This test does not establish exhaustive deployment-wide path coverage. That requires architecture-specific enumeration and adversarial testing of every effect-capable route.',
  }, null, 2));
})().catch((error) => {
  console.error('V114_EXECUTION_BOUNDARY_FALSIFICATION: FAIL');
  console.error(error);
  process.exit(1);
});
