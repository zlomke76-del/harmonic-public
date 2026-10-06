# V120 / RED TEAM 004 — Comparison and Disposition

## Frozen distinction

> **Valid authority artifact ≠ currently intact authority chain.**

## Controlled pair

| Dimension | Case A | Case B |
|---|---|---|
| Frozen root trust anchor R₀ | fixed | fixed |
| B→C delegation artifact | valid / unchanged | valid / unchanged |
| C authority instrument | current / signed / attributable / internally valid | current / signed / attributable / internally valid |
| Domain facts and governing rule | fixed | fixed |
| R₀→B current empowerment | GOVERNING | NON_GOVERNING_SUPERSEDED; competence moved to B2 |
| Pack authority-chain status | INTACT | BROKEN_UPSTREAM_EMPOWERMENT |
| Pack constitution status | `CONSTITUTED` | `UNRESOLVED_AUTHORITY_CHAIN` |
| Pack proposition value | `EU-WEST` | `null` |
| Pack governing source | `execution-region-registry-a` | `null` |
| Harmonic downstream witness | `PERMITTED / allow` | `REFUSED / refuse` |

## Disposition

**PASS — BOUNDED. Independently accepted as run.**

The Pack did not allow the unchanged validity of the B→C delegation or C authority instrument to prove continuity of the higher-order empowerment path. When independent R₀→B evidence changed, the Pack stopped treating C as governing and returned an unresolved authority-chain state.

## Preserved caveat

Harmonic's `authority_continuity` primitive still reports `AUTHORITY_CONTINUOUS` in Case B. Therefore the evidence does not establish that Harmonic independently reconstructs the R₀→B→C authority-chain break. The Pack-level result is primary; Harmonic is downstream witness evidence only.

## Claim ceiling

No claim is made about external truth or legitimacy of R₀, universal recursive authority closure, universal institutional legitimacy, independent Harmonic chain reconstruction, or downstream physical execution.
