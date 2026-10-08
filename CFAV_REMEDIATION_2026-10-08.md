# CFAV Public-Reference Remediation — 2026-10-08

## Boundary

This corrective successor addresses findings reported against the public repository
commit `781d1b7cc213542537d8392cd34b4726df1358a3`. It does not establish anything
about the unpublished sovereign Harmonic production runtime.

The predecessor evidence remains historical. This release does not rewrite the
reported observation; it changes the successor public implementation.

## Corrected findings

### HCFAV-01 — mixed authority disposition

The public evaluator previously derived its top-level disposition before applying
revocation, expiry, and scope-mismatch signals. The successor adds explicit
fail-closed authority findings before disposition derivation. A represented revoked,
expired, or scope-incompatible authority state can no longer coexist with an
execution-admitting top-level result.

Regression coverage:

- explicit revocation -> blocked / deny;
- expired authority -> blocked / deny;
- scope mismatch -> blocked / deny;
- current in-scope authority retains the positive stable / allow control.

### HCFAV-02 — insufficient receipt verification in the public guard

The public evaluator now returns short-lived reference bindings for the exact
submitted packet and represented operation. The teaching guard verifies those
bindings and requires an integration-supplied `verifyReceipt` function before any
effect.

The included hash/expiry helper is deliberately labeled public-reference-only. It is
not a signature verifier and must not be represented as production authentication.

### HCFAV-03 — evaluation-to-effect temporal gap

The teaching guard now requires an integration-owned `refreshCurrentPacket`
function and reacquires current state again at the effect boundary. If the current
packet materially changes, it must earn a new execution-admitting determination
before execution.

This reduces and exposes the race; it does not claim atomicity. Production systems
must bind the exact consequence to an authenticated determination at the actual
effect-capable receiver and define invalidation/reconciliation behavior.

### HCFAV-04 — missing public-boundary file

`V4_PUBLIC_BOUNDARY.md` is restored. `npm run verify:public-boundary` now succeeds
from the corrected repository tree.

### HCFAV-05 — missing/future freshness acceptance

When a positive freshness window is declared, the successor treats missing,
invalid, materially future-dated, and stale verification timestamps as fail-closed
truth-basis findings. A five-minute future clock-skew tolerance is explicit.

## Verification performed on this successor

The corrective package was checked with:

```text
npm run check
npm run test:regressions
npm run verify:public-boundary
npm run test:vectors
npm run verify:successor-evidence
node examples/raw-vs-governed/run.js
```

Observed result at packaging time: all commands passed. The regression suite reports
22 passing tests and 0 failures, including authority-disposition, freshness,
receipt-binding, mandatory revalidation, failed-continuity, and effect-time-change
cases.

## Claim ceiling

This record establishes only the behavior exercised in this corrected public
reference repository. It does not establish production receipt authentication,
exhaustive effect-path coverage, atomic source/effect coupling, independent source
truth, or sovereign-runtime behavior.
