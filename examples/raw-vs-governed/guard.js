// Public-reference adapter. Production receipt verification belongs in its own adapter.
async function guardedExecute({ baseUrl, packet, execute, fetchImpl = fetch }) {
  let receipt;
  try {
    const response = await fetchImpl(`${baseUrl.replace(/\/$/, '')}/api/evaluate`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(packet), signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`Evaluation HTTP ${response.status}`);
    receipt = await response.json();
    if (receipt.packet_id !== packet.packet_id || receipt.public_release !== true ||
        receipt.outcome !== 'stable' || receipt.admissible !== true ||
        receipt.recommended_action !== 'allow') {
      return { executed: false, receipt };
    }
  } catch (error) {
    return { executed: false, error: error.message };
  }
  return { executed: true, receipt, consequence: await execute() };
}
module.exports = { guardedExecute };
