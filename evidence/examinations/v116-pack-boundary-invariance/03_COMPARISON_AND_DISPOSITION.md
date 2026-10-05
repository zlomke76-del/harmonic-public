# V116 Evidence Comparison

## Raw source artifacts
- Case A raw export: `01_CASE_A_RAW_HARMONIC_EXPORT.txt`
- Case B raw export: `02_CASE_B_RAW_HARMONIC_EXPORT.txt`

## File integrity
- Case A raw file SHA-256: `8871c36e25a5544fc8f88ae6c9534d149df58db71a500bd1c7fc51d2b74a66eb`
- Case B raw file SHA-256: `1ec23f73e00fe75b04b5532bb5d726ad0dc428ae33b77fea4a66700255e4eed8`

## Harmonic canonical outbound packet integrity
- Case A canonical packet SHA-256: `a28f6795fb486d71b376fc7e3fbb171f2f59b3bbe37fd8ffa671a6f5312b3865`
- Case B canonical packet SHA-256: `d20b5577303b9a5a5e0a5a1ee273814008bb5b7ac77c3abef22cfbb710c7cd7b`

## Frozen Specialty Pack representation observed in both specimens

Both exports record:
- `specialty_pack`: `federation-domain-pack@1.0.0`
- `relationship_id`: `v116-invariant-relationship-001`
- `relationship`: `consistent_with_prior_state`
- `relationship_basis`: `rule-r1 equality evaluation over independently attributable authority A/B region facts`
- `domain_rule_ref`: `rule-r1@1`
- attributable sources: `authority-a-state-116`, `authority-b-state-116`
- scope: `federated_shared_consequence`
- freshness: `current`
- provenance: `preserved`
- evidence_sufficiency: `complete`
- constitutional_answer_supplied: `false`

## Prospectively allowed specimen differences

The canonical packet pair differs in:
1. `packet_id`
2. `obligation_witness.status`
   - Case A: `not_applicable`
   - Case B: `unsatisfied`
3. the second `obligation_witness.evidence_refs` value
   - Case A: `constitutional-hold:c2-inactive`
   - Case B: `constitutional-hold:c2-active`

No Specialty Pack relationship field changed.

## Observed Harmonic results

### Case A
- outcome: `PERMITTED`
- admissible: `true`
- action: `allow`
- obligation continuity: `NOT_APPLICABLE`
- execution boundary: `should_execute=true`, `should_block_execution=false`
- downstream physical execution: not established by this run

### Case B
- outcome: `REFUSED`
- admissible: `false`
- action: `refuse`
- obligation continuity: `OBLIGATION_UNSATISFIED`
- blocking signal: `binding_obligation_unsatisfied`
- execution boundary: `should_execute=false`, `should_block_execution=true`
- downstream physical execution: not established by this run

## Transport / construction controls

Both records state:
- exact packet replay
- no model used in packet construction
- no semantic translation
- no harness inference
- no harness freshness stamping
- Harmonic retained disposition authority

## Disposition

**PASS — BOUNDED**

Observed property:

> Semantically invariant Specialty Pack representation was preserved while a prospectively isolated downstream constitutional change produced different Harmonic determinations.

Claim ceiling:

This package does not establish universal absence of answer leakage, independent truth/completeness of upstream domain facts, universal non-bypassability, or downstream physical execution/non-execution. It records the bounded V116 pair and its observed Harmonic determinations.
