# Harmonic V4 Public Repository Boundary

This repository is a public architecture contract, public-safe reference evaluator,
SDK/example surface, and frozen evidence archive. It does **not** contain the
sovereign production Harmonic runtime, private credential paths, production control
plane, or unrestricted execution authority.

## Evidence is not runtime configuration

Preserved examinations, fixtures, reports, and historical packets document what was
observed under identified conditions. They do not silently become current runtime
configuration, present authority, or execution permission.

A historical PASS remains historical evidence. It does not renew standing for a new
consequence, a changed implementation, or a later authority state.

## Public evaluator

`POST /api/evaluate` is a public reference evaluator. Its output is intended for
inspection and integration teaching. The public reference now enforces these
non-contradiction invariants when the corresponding facts are represented:

- explicitly revoked authority cannot return an execution-admitting top-level result;
- expired authority cannot return an execution-admitting top-level result;
- explicit authority/request scope mismatch cannot return an execution-admitting top-level result;
- when a freshness window is declared, missing, invalid, materially future-dated, or stale verification time is fail-closed.

The reference evaluator does not independently establish the truth, competence, or
authenticity of caller-supplied authority/evidence. Those remain integration and
institutional responsibilities.

## Execution example

`examples/raw-vs-governed/guard.js` is a teaching adapter, not the sovereign
execution boundary. It fails closed unless the integrator supplies:

1. a current-state revalidation function that reacquires the authority/evidence state
   immediately before the consequential effect; and
2. a receipt-verification function appropriate to the deployment trust model.

The included public-reference hash/expiry helper is not a cryptographic signature
verifier and must not be represented as production receipt authentication.

The example reduces and exposes the evaluation-to-effect race. It does not claim
atomicity. Production systems must bind the exact immutable consequence to an
authenticated decision at every effect-capable path, define invalidation semantics,
and reconcile ambiguous provider acceptance before retry.

## Frozen evidence lineage

Frozen evidence remains immutable. Corrective public releases are successor
implementations. They do not rewrite predecessor observations or promote earlier
bounded results into universal claims.
