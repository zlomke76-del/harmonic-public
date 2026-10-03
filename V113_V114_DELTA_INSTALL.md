# V113 / V114 public evidence full-files delta

Extract over the root of harmonic-public-main (2). Contains complete changed and
new files, with repository paths preserved.

Added: public V113 adjudication/record and original forensic manifest; V114
freeze/result/test; local publication manifests; two result pages; links from
homepage and docs; verification command. Root and public copies match.
Private runtime, private source ZIPs, and forensic package excluded.

Verification: private V114 reproduced all seven recorded cases with one positive
consequence and no unauthorized consequence. Canonical V113 forensic ZIP digest
matched 2650fa0d02e959d86a44494938076eb0d4f0f1ed6ce99e3e295a2707fae284cd.
V113 production records were not rerun. Original evidence bytes were preserved.
V114 fixture evidence does not test database persistence, and expired-receipt
rejection does not establish unexpired replay prevention.

Passed: verify:successor-evidence, check, test:vectors, verify:public-boundary,
test:examples (10 tests), example:raw-vs-governed, verify:evidence.

Run: npm run verify:successor-evidence
No GitHub push or hosted deployment performed.
