# V118 — RED TEAM 003 — Full Evidence Package

## Examination
**Registry Content Validity vs Registry / Issuer Authority Standing**

Frozen proposition:

> A Specialty Pack must distinguish the validity of an authority statement from the current standing of the authority that empowers it.

Frozen distinction:

> **Registry content validity ≠ registry / issuer authority standing.**

Frozen anti-circularity rule:

> **The registry cannot establish its own present authority solely through the statement whose authority is under examination.**

Frozen falsifier:

> **Can a current, signed, internally valid authority statement become non-governing because the authority behind the statement changed — and does the Pack notice?**

## Recorded result
**V118 — PASS, BOUNDED.**

Case A preserved a valid authority-registry statement and independently represented the issuer as currently governing. The Pack admitted the statement, constituted the proposition, and selected Source A.

Case B preserved the registry record as equally valid, current, signed, attributable and unchanged, while independent charter evidence represented the issuer as `NON_GOVERNING_SUPERSEDED`. The Pack did not continue treating the registry statement as governing. It returned `UNRESOLVED_AUTHORITY_STANDING`, with no constituted proposition value and no governing source.

The downstream Harmonic exact replay then returned:

- Case A: `PERMITTED / admissible=true / action=allow`
- Case B: `REFUSED / admissible=false / action=refuse`

The Harmonic result is **secondary witness evidence only** and does not rescue or determine the Pack-level PASS.

## Claim ceiling
The package supports only this bounded claim:

> **Given independently supplied issuer-standing evidence, the examined Specialty Pack distinguished registry-content validity from the current standing of the authority empowering that registry statement, and refused to treat the still-valid statement as governing after issuer standing ended.**

It does **not** establish:

- the external truth or ultimate legitimacy of the charter evidence;
- a universally valid root authority model;
- that all possible authority-recursion chains terminate correctly;
- independent external truth verification by Harmonic;
- downstream physical execution or non-bypassability outside the examined response boundary.

## Important pre-run integrity repair
The first V118 packaging attempt contained upstream successor-status fields that the public harness correctly rejected as a case-specific constitutional answer. Those fields were removed before the recorded runs in this package. The corrected V118.1 exact-replay packets contain the transition relationship but do not preload `prior_state_status` or `revalidation_required` as caller-supplied disposition fields. See `09_PROVENANCE_AND_FREEZE_NOTE.md`.

## Package structure
- `01_FROZEN_PROTOCOL/` — frozen RED TEAM 003 protocol and responsibility map.
- `02_SPECIALTY_PACK_CASES/` — Case A/B Pack inputs and outputs.
- `03_HARMONIC_PACKETS/` — exact replay packets actually used for the recorded runs.
- `04_RAW_HARMONIC_EXPORTS/` — complete exported harness/runtime records supplied after the runs.
- `05_COMPARISON_AND_DISPOSITION.md` — bounded comparison and disposition.
- `06_EVIDENCE_MANIFEST.json` — evidence index and key recorded outcomes.
- `07_SHA256SUMS.txt` — SHA-256 inventory for package contents.
- `08_SOURCE_IMPLEMENTATION/` — corrected V118.1 harness package, full-files delta and V118 delta manifest.
- `09_PROVENANCE_AND_FREEZE_NOTE.md` — chronology, fixation limits and non-claims.
- `10_PRE_RUN_INTEGRITY_REPAIR.md` — description of the rejected initial packet shape and the correction made before the recorded runs.
