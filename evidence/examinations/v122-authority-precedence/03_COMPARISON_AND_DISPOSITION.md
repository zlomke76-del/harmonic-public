# Comparison and disposition

## Frozen proposition

**authority validity ≠ authority precedence**

| Case | Concurrent valid paths | Precedence relation | Pack result | Harmonic witness |
|---|---|---|---|---|
| A | C₁→PERMIT; C₂→REFUSE | constituted and applicable | `CONSTITUTED_WITH_PRECEDENCE` | `PERMITTED / allow` |
| B | C₁→PERMIT; C₂→REFUSE | absent for conflict | `UNRESOLVED_AUTHORITY_CONFLICT` | `REFUSED / refuse` |

**Disposition:** PASS — BOUNDED, independently accepted as run. Candidate-order reversal preserved both results.

**Ceiling:** Harmonic remained `AUTHORITY_CONTINUOUS` in Case B; the earned PASS is at the Specialty Pack precedence boundary.
