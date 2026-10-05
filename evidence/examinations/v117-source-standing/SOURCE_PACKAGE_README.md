# V117 — Source Standing vs Source Continuity
## Full Evidence Package for Independent Inspection

**Examination:** V117-SOURCE-STANDING-001 / RED TEAM 002  
**Frozen proposition:** A Specialty Pack must distinguish source freshness and source continuity from current source standing.  
**Frozen distinction:** Historically authoritative is not equivalent to currently governing for this proposition.  
**Disposition from the recorded run:** **PASS — BOUNDED**  

This package preserves the prospective freeze, the frozen source-responsibility map, both Specialty Pack inputs and outputs, both exact Harmonic packets, both raw Harmonic exports, the implementation snapshot used to construct V117, and a comparison/disposition record.

## What was frozen

Only the current source-authority state was permitted to differ across the pair, apart from specimen/packet identity. Source records, source content, freshness, provenance, static hierarchy, domain rule, consequence, observed time, and Pack code were frozen.

The source-selection rule was also frozen prospectively: select the source whose authority state is `GOVERNING` for the proposition at `observed_at` and whose effective interval contains `observed_at`; do not substitute freshness, confidence, availability, historical primacy, or hierarchy position for current governing authority.

## Cases

- **Case A:** Source A remains current, attributable, unchanged, and governing for the proposition.
- **Case B:** Source A remains equally current, attributable, and unchanged in content, but its governing interval has ended; Source B is governing for the proposition.

## Recorded outcome

- **Case A Pack constitution:** `EU-WEST`, governing source `execution-region-registry-a`, relationship `consistent_with_prior_state`.
- **Case B Pack constitution:** `US-EAST`, governing source `execution-region-registry-b`, relationship `material_contradiction`.
- Both Pack outputs record `source_freshness_preserved=true`, `source_provenance_preserved=true`, and `static_hierarchy_ignored_as_authority_proxy=true`.
- **Case A Harmonic:** `PERMITTED / admissible=true / action=allow`.
- **Case B Harmonic:** `REFUSED / admissible=false / action=refuse`; the blocking signal is `material_state_transition` against the caller-attributed `material_contradiction`.

## Claim ceiling

A PASS is bounded to this frozen source map, source-selection rule, synthetic records, Pack implementation, and Harmonic interface. It does **not** establish universal source legitimacy, independent truth of the institutional source registry, universal source-standing correctness, or downstream physical enforcement.

The V117 primary falsifier is evaluated at the Specialty Pack source-selection boundary. The Harmonic replay is downstream witness evidence and cannot rescue an incorrect Pack constitution.

## Package layout

- `01_FROZEN_PROTOCOL/` — prospective freeze, responsibility map, fixture README.
- `02_SPECIALTY_PACK_CASES/` — frozen case inputs and Pack outputs.
- `03_HARMONIC_PACKETS/` — exact packets submitted to Harmonic.
- `04_RAW_HARMONIC_EXPORTS/` — complete raw exports from the two recorded production replays.
- `05_COMPARISON_AND_DISPOSITION.md` — bounded comparison and disposition.
- `06_EVIDENCE_MANIFEST.json` — source hashes, packet hashes, run metadata, and claim boundaries.
- `07_SHA256SUMS.txt` — SHA-256 inventory of package files (excluding this checksum file itself).
- `08_SOURCE_IMPLEMENTATION/` — full V117 harness snapshot, full-files delta, and V117 delta manifest.
- `09_PROVENANCE_AND_FREEZE_NOTE.md` — chronology and evidentiary limits of the freeze record.
