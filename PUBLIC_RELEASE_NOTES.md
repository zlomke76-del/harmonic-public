## 2026-10-06 — V121 / V122 preserved successor evidence

- Added V121 / RED TEAM 005 — PASS, BOUNDED, independently accepted as run.
- Added V122 / RED TEAM 006 — PASS, BOUNDED, independently accepted as run.
- Preserved exact bounded ceilings: Harmonic remains downstream witness evidence only for the scoped fracture and precedence conflict.
- Added evidence pages, direct acceptance records, full evidence packages, and public inspection paths.
- No public reference evaluator behavior changed.

## 4.0.0-public.2 — V118 acceptance + V120 RED TEAM 004 evidence

- Updated V118 to record Wojciech Z. Kaleta, PhD acceptance: **PASS — BOUNDED. Accepted as run.**
- Added V120 / RED TEAM 004: **Valid authority artifact ≠ currently intact authority chain.**
- V120 is **PASS — BOUNDED, independently accepted as run**.
- Preserved the explicit V120 ceiling: Harmonic's `authority_continuity` primitive remains `AUTHORITY_CONTINUOUS` in Case B, so the result does not establish independent Harmonic chain reconstruction.
- Added standalone V120 evidence page and preserved evidence directory/package.
- No public runtime behavior is modified by this evidence update.

# Public Release Notes

## 4.0.0-public.1 — contract and evidence alignment

This public repository has been aligned with the Harmonic v4.0.0 public architecture contract without publishing the sovereign production runtime implementation.

Changes:

- public documentation now identifies the production contract as `runtime_version: 4.0.0` / `api_version: v4-single-call`;
- constitutional determinations are separated from execution-facing directives;
- response-contract binding is explicitly separated from downstream execution enforcement;
- the included `api/evaluate.js` implementation is clearly labeled as a public-safe reference/demo evaluator rather than the production runtime;
- the frozen Decision Engineering T4 v1.1 evidence archive is included, including negative and qualified findings;
- the evidence archive is explicitly evidence-only and does not modify the runtime that generated it.

## Public-safe removal boundary

Operational/private surfaces remain excluded, including:

- Stripe checkout and webhook routes;
- Supabase service-role access paths;
- API-key creation/revocation routes;
- customer console and account routes;
- authenticated private replay/continuity storage implementation;
- private telemetry and production orchestration internals;
- sovereign production constitutional-runtime source.

The remaining repository contains no intended production secrets and requires no private infrastructure credentials for its reference/demo mode.
