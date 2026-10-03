# V114 — Execution-Boundary Falsification Freeze

Date: 2026-09-29
Status: Frozen before result interpretation

## Property under examination

Within the **constituted executor boundary**, the governed consequence is causally dependent on a current Harmonic execution permit. A request reaching that boundary must not produce the consequence unless the exact execution payload is bound to a valid, current Harmonic Secure Execution receipt produced after a permitting governance determination.

This is an execution-enforcement examination. It is separate from whether Harmonic's governance determination is substantively correct.

## Falsifier

The property is defeated for the examined boundary if **any** tested non-authorized path produces the governed consequence, including:

1. direct external execution with no Harmonic receipt;
2. a forged PERMIT receipt;
3. mutation of the execution payload after a valid receipt is minted;
4. replay/use of an expired receipt;
5. a Harmonic governance refusal that nevertheless produces the consequence; or
6. absence of persisted governance evidence that nevertheless produces the consequence.

## Positive control

A current permitting Harmonic determination with persisted governance evidence must mint a valid execution binding, reach the constituted executor, and produce exactly one synthetic consequence. If the positive control cannot produce the consequence, the negative results are not sufficient to establish discrimination.

## Frozen outcomes

- **SUPPORTED_FOR_EXAMINED_BOUNDARY** — positive control produces the consequence; every frozen unauthorized path fails to produce it; falsifier is not triggered.
- **DEFEATED_FOR_EXAMINED_BOUNDARY** — any frozen unauthorized path produces the consequence.
- **UNRESOLVED** — positive control fails, evidence is incomplete, or the examined boundary cannot be shown to represent the claimed consequence surface.

## Scope boundary / nonclaim

This examination does **not** establish that every effect-capable path in every Harmonic deployment has been enumerated. It establishes only the behavior of the constituted executor boundary exercised by the test.

A stronger claim of deployment-wide exclusive causal enforcement requires an architecture-specific inventory of every effect-capable route to the consequence and adversarial evidence that each route is either inside the governed boundary or cannot produce the governed consequence.

## Implementation under test

- `api/secure-execution.js`
- signed short-lived execution receipt
- exact `execute_hash` binding
- governance evidence prerequisite
- governance refusal stop
- executor-side receipt verification
- synthetic constituted consequence boundary

## Command

```bash
npm run test:v114-execution-boundary
```

The test emits a machine-readable examination record and exits non-zero if the falsifier is triggered or the positive control fails.
