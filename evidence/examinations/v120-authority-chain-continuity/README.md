# V120 / RED TEAM 004 — Authority Artifact Validity vs Authority-Chain Continuity

**Status:** **PASS — BOUNDED · independently accepted as run by Wojciech Z. Kaleta, PhD.**

## Frozen proposition

> A Specialty Pack must distinguish the continued validity of an intermediate authority artifact from the continued standing of the authority path that empowers it.

Frozen distinction:

> **Valid authority artifact ≠ currently intact authority chain.**

## Frozen chain

`R₀ → B → C → Source A`

`R₀` is prospectively frozen as the external trust anchor and remains outside the falsifier.

Across the pair, the B→C delegation and C authority instrument remain current, signed, attributable, internally valid and unchanged. Only the independently established R₀→B empowerment relation changes.

## Bounded result

- **Case A:** current empowerment path intact → Pack `CONSTITUTED`; Harmonic downstream witness `PERMITTED / allow`.
- **Case B:** intermediate artifacts remain valid but the upstream empowerment path no longer reaches C → Pack `UNRESOLVED_AUTHORITY_CHAIN`, `proposition_value = null`, `governing_source_id = null`; Harmonic downstream witness `REFUSED / refuse`.

Wojciech Z. Kaleta, PhD accepted the disposition **PASS — BOUNDED** as run.

## Harmonic caveat

In Case B, Harmonic's `authority_continuity` primitive still reports `AUTHORITY_CONTINUOUS`. The refusal is driven by the Pack's invalidating constituted-state transition through `understanding_continuity` / runtime admissibility.

Accordingly, V120 does **not** establish that Harmonic independently reconstructs the R₀→B→C break. The PASS is earned at the Specialty Pack authority-chain admission boundary. Harmonic is downstream witness evidence only.

## Claim ceiling

V120 does not establish external truth or legitimacy of R₀, universal recursive authority closure, universal institutional legitimacy, independent Harmonic authority-chain reconstruction, or downstream physical execution.

## Preserved files

- `00_FROZEN_PROTOCOL.md` — prospectively frozen RED TEAM 004 protocol.
- `00_FROZEN_PROTOCOL.json` — machine-readable freeze.
- `00_RESPONSIBILITY_MAP.json` — frozen responsibility map.
- `01_CASE_A_RAW_HARMONIC_EXPORT.txt` — current-production exact replay, Case A.
- `02_CASE_B_RAW_HARMONIC_EXPORT.txt` — current-production exact replay, Case B.
- `03_COMPARISON_AND_DISPOSITION.md` — bounded comparison and result.
- `04_EVIDENCE_MANIFEST.json` — machine-readable evidence summary.
- `05_WOJCIECH_ACCEPTANCE.md` — independent acceptance.
- `06_PROVENANCE_AND_FREEZE_NOTE.md` — chronology and claim-boundary note.
- `07_SPECIALTY_PACK_ARTIFACTS/` — exact Pack inputs/outputs, Harmonic packets, executable reference and fixture test.
- `V120_RED_TEAM_004_Full_Evidence_Package.zip` — complete submitted package.
- `SHA256SUMS.txt` — directory checksums.

Evidence record only. No broader claim is earned.
