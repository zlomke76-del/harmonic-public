# CFAV Similitude Public-Reference Remediation — 2026-10-09

## Boundary

This corrective successor addresses three representation-shadowing findings reported against the public repository commit `ac8fb2fb7d148580528b0d4335bb5c5d15debd61`. It changes only the public-safe reference implementation and its teaching contract. It does **not** establish or modify behavior of the unpublished sovereign Harmonic production runtime.

The predecessor commit and the external assessment remain historical evidence. This successor does not rewrite either.

## Adjudicated findings

### HSG-01 — observation source shadowing

**Disposition: established for the public reference; corrected.**

An empty `truth.observations` array could suppress contradictory represented signals in `observed_state.signals` / `observed_reality.signals` because JavaScript treats an empty array as truthy in the previous fallback expression. The successor considers all represented observation lanes together for contradiction detection.

### HSG-02 — authority fallback shadowing

**Disposition: established for the public reference; corrected conservatively.**

A populated `authority` object could suppress represented revocation facts in the compatibility `accountability` object. The successor fail-closes if any represented authority/accountability revocation fact is true. This is a public-reference non-contradiction rule, not a universal institutional precedence claim.

### HSG-03 — conflicting expiry shadowing

**Disposition: established for the public reference; corrected conservatively.**

A future generic `expires_at` value could mask an already-expired `mandate_expires_at` or `delegation_expires_at` because the previous implementation selected the first truthy expiry. The successor evaluates all represented expiry facts and fail-closes if any represented authority/mandate/delegation expiry is expired.

### HSG-04 — principal identity disagreement

**Disposition: not established as an authorization defect.**

The public contract does not currently declare that `accountability.responsible_actor` and `authority.responsible_actor` must be the same principal. Distinct delegator, operator, effective principal, and consequence-owner roles can be legitimate when typed and bound. No runtime change is made for this finding.

### HSG-05 — commit/acknowledgment ambiguity

**Disposition: established as a known example/finality limitation; not a new Harmonic-core defect.**

The public boundary already states that the teaching example does not claim atomicity and requires target-native idempotency and reconciliation for ambiguous provider acceptance. No new core behavior is claimed here.

## Regression coverage

The successor adds bounded tests that require:

- an empty preferred observation lane cannot erase a contradictory observed-state revocation signal;
- a populated `authority` object cannot erase a represented `accountability` revocation;
- a future generic expiry cannot erase an already-expired mandate expiry;
- duplicate, non-conflicting authority representations preserve the stable/allow positive control.

## Claim ceiling

This record establishes only the corrected behavior exercised in this public reference repository. It does not establish sovereign-runtime behavior, production ingress authenticity, universal source precedence, exhaustive execution-path coverage, or atomic real-world consequence prevention.
