# V114 — execution-boundary evidence record

Preserved result: **SUPPORTED_FOR_EXAMINED_BOUNDARY**.
Read [V114_FREEZE.md](V114_FREEZE.md), [V114_RESULT.json](V114_RESULT.json),
and the preserved [V114_TEST.js](V114_TEST.js).

The freeze is dated September 29, 2026; the supplied result is dated October 1,
2026. The private repository test was rerun during the October 3 publication
review and its result, cases, and consequence counts matched the preserved record.
This rerun is repository-local verification, not independent attestation.

Positive control: exactly one synthetic consequence. Six unauthorized cases:
receiptless bypass, attacker-signed permit, payload tamper, expired permit,
governance refusal, and missing governance evidence. Each produced no consequence.

The preserved test is an evidence artifact, **not a runnable public-repo test**.
Its relative import targets the original private `scripts/` location. Reproduction
requires the matching private implementation and the command stated in the freeze;
no private implementation is published here. Do not rewrite the preserved source
merely to make its import resolve in this evidence directory.

The test supplies fixture governance dispositions and evidence identifiers;
it exercises execution binding and verification, not a live governance decision
or database persistence round trip. Its expired-receipt case does not test reuse
of an otherwise valid unexpired receipt. It does not enumerate all deployment
paths or establish deployment-wide exclusive enforcement.

`SHA256SUMS.txt` verifies the public files in this directory. The supplied freeze,
result, and test retain their original bytes. The V113 response-boundary finding
and the older examination lineage remain unchanged.
