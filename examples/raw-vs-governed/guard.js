const crypto = require('node:crypto');

function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
}

function sha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

function verifyReferenceReceiptBinding({ packet, receipt, now = Date.now() }) {
  const binding = receipt?.reference_binding;
  if (!binding || typeof receipt?.artifact_hash !== 'string' || !/^[a-f0-9]{64}$/i.test(receipt.artifact_hash)) return false;
  if (binding.request_hash !== sha256(stableStringify(packet))) return false;
  const operation = packet?.execution_request || packet?.requested_action || null;
  if (binding.operation_hash !== sha256(stableStringify(operation))) return false;
  const validUntil = new Date(binding.valid_until).getTime();
  if (!Number.isFinite(validUntil) || validUntil <= now) return false;
  return true;
}

function isExecutionAdmitting(receipt, packet) {
  return receipt?.packet_id === packet?.packet_id &&
    receipt?.public_release === true &&
    receipt?.outcome === 'stable' &&
    receipt?.admissible === true &&
    receipt?.recommended_action === 'allow' &&
    receipt?.runtime_continuity?.survivability === 'surviving' &&
    receipt?.runtime_continuity?.admissibility_window === 'open' &&
    receipt?.runtime_continuity?.escalation_required === false;
}

async function evaluate({ baseUrl, packet, fetchImpl }) {
  const response = await fetchImpl(`${baseUrl.replace(/\/$/, '')}/api/evaluate`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(packet), signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`Evaluation HTTP ${response.status}`);
  return response.json();
}

// Public teaching boundary. It deliberately requires two integration-owned controls:
// (1) refreshCurrentPacket must reacquire the current authority/evidence state immediately
//     before effect, and
// (2) verifyReceipt must authenticate the decision under the deployment's real trust model.
// The included verifyReferenceReceiptBinding helper validates only public-reference hashes/expiry;
// it is NOT a production signature verifier.
async function guardedExecute({ baseUrl, packet, execute, refreshCurrentPacket, verifyReceipt, fetchImpl = fetch }) {
  if (typeof refreshCurrentPacket !== 'function') {
    return { executed: false, error: 'Current-state revalidation is required before execution.' };
  }
  if (typeof verifyReceipt !== 'function') {
    return { executed: false, error: 'Authenticated receipt verification is required before execution.' };
  }

  try {
    let currentPacket = await refreshCurrentPacket(packet, null);
    if (!currentPacket || typeof currentPacket !== 'object') throw new Error('Revalidation did not return a current packet.');
    if (currentPacket.packet_id !== packet.packet_id) throw new Error('Revalidation changed packet identity.');

    let receipt = await evaluate({ baseUrl, packet: currentPacket, fetchImpl });
    if (!isExecutionAdmitting(receipt, currentPacket) || !(await verifyReceipt({ packet: currentPacket, receipt }))) {
      return { executed: false, receipt };
    }

    // Reacquire state again at the effect boundary. If anything material changed,
    // the refreshed packet is evaluated again and must earn a new execution-admitting receipt.
    const effectPacket = await refreshCurrentPacket(currentPacket, receipt);
    if (!effectPacket || typeof effectPacket !== 'object') throw new Error('Effect-time revalidation did not return a current packet.');
    if (effectPacket.packet_id !== currentPacket.packet_id) throw new Error('Effect-time revalidation changed packet identity.');

    if (stableStringify(effectPacket) !== stableStringify(currentPacket)) {
      currentPacket = effectPacket;
      receipt = await evaluate({ baseUrl, packet: currentPacket, fetchImpl });
      if (!isExecutionAdmitting(receipt, currentPacket) || !(await verifyReceipt({ packet: currentPacket, receipt }))) {
        return { executed: false, receipt };
      }
    }

    return { executed: true, receipt, consequence: await execute({ packet: currentPacket, receipt }) };
  } catch (error) {
    return { executed: false, error: error.message };
  }
}

module.exports = { guardedExecute, verifyReferenceReceiptBinding, stableStringify, sha256 };
