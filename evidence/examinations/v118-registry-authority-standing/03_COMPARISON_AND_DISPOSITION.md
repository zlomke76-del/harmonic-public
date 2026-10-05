# V118 Comparison and Disposition

## Frozen question
Can a current, signed, internally valid authority statement become non-governing because the authority behind the statement changed — and does the Pack notice?

## Frozen variables
The authority-registry statement itself remains unchanged across the pair. The examination separates:

- registry content validity;
- registry / issuer authority standing.

The registry is prohibited from proving its own current authority solely by asserting that it is authoritative.

## Case A — issuer still standing
The Pack output records:

- `constitution_status = CONSTITUTED`
- `registry_statement_content_valid = true`
- `registry_issuer_standing = GOVERNING`
- independent standing evidence source = `institutional-charter-registry`
- `anti_circularity_satisfied = true`
- `proposition_value = EU-WEST`
- `governing_source_id = execution-region-registry-a`

The downstream exact Harmonic replay records:

- `PERMITTED`
- `admissible = true`
- `action = allow`

## Case B — issuer standing ended
The registry statement remains internally valid, current, signed, attributable and unchanged. Independent charter evidence represents its issuer as `NON_GOVERNING_SUPERSEDED`.

The Pack output records:

- `constitution_status = UNRESOLVED_AUTHORITY_STANDING`
- `registry_statement_content_valid = true`
- `registry_issuer_standing = NON_GOVERNING_SUPERSEDED`
- independent standing evidence source = `institutional-charter-registry`
- `anti_circularity_satisfied = true`
- `proposition_value = null`
- `governing_source_id = null`

The Pack therefore does not convert record validity into governing authority.

The downstream exact Harmonic replay records:

- `REFUSED`
- `admissible = false`
- `action = refuse`

Its controlling understanding path reflects the caller-attributed upstream state transition. That runtime refusal is downstream witness evidence and is not the basis for the Pack-level disposition.

## Disposition
**PASS — BOUNDED.**

The frozen FAIL condition did not occur in this pair. The Pack did not continue treating the authority-registry statement as governing merely because the record remained current, signed, attributable, internally valid or historically designated as authoritative.

The frozen UNRESOLVED condition also did not occur at the architecture-representation level: the Pack represented registry content validity separately from issuer standing and produced a distinct unresolved constitution state when issuer standing ended.

## Claim ceiling
The result supports:

> **Given independently supplied issuer-standing evidence, the examined Specialty Pack distinguished a valid authority statement from the current standing of the authority empowering it.**

It does not prove that the charter evidence is externally true or legitimately constituted at the next recursive authority layer. That is a separate examination boundary.
