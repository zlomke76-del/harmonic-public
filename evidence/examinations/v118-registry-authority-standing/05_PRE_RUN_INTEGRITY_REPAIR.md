# V118.1 Pre-Run Integrity Repair

## What failed
The initial V118 packet construction included caller-supplied successor-status fields (`prior_state_status` and `revalidation_required`) alongside the transition relationship. The public harness successor-integrity guard rejected that shape because a case-specific constitutional answer was present upstream.

## Why the rejection mattered
RED TEAM 003 is supposed to test whether the Pack distinguishes valid registry content from issuer standing. It must not obtain the desired runtime result by preloading Harmonic's own constitutional disposition fields.

## Repair applied before the recorded runs
The V118.1 packets were changed so that:

- Case A supplies `relationship = consistent_with_prior_state`;
- Case B supplies `relationship = invalidates_prior_state`;
- the caller does not preload `prior_state_status`;
- the caller does not preload `revalidation_required`;
- the fixture regression rejects future reintroduction of those answer-bearing fields.

## Recorded-run confirmation
The raw runtime exports preserved in `04_RAW_HARMONIC_EXPORTS/` show the runtime's state transition with `prior_state_status: null` and `revalidation_required: null`, while Harmonic independently returns the downstream admissibility outcome.

The repair occurred before the two raw exports preserved in this package and therefore does not constitute a post-result rescue of the recorded examination pair.
