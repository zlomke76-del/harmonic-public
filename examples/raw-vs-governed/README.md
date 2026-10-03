# Watch a pending tool call outlive its authority

A supplier's NDA is active at T0. An agent proposes releasing a design. Before
execution, the NDA registry records revocation (Delta N). At Tn, the raw executor
still sends the release. The guarded executor sends the same proposal and current
registry evidence to `POST /api/evaluate` and withholds the release on `blocked / deny`.

## Run in one command

Node 20+; no packages, credentials, or external services required:

```bash
node examples/raw-vs-governed/run.js
```

The script starts the repository's actual public reference HTTP evaluator and a
fictional disclosure sink on an ephemeral loopback port, then closes both. It
asserts the observed HTTP consequences, rather than printing a preselected verdict:

```text
RAW: HTTP release executed; unjustified disclosure recorded.
GOVERNED: no release request sent. Exact wire receipt:
... full receipt from the reference API ...
CONTROL: unchanged active NDA -> stable / allow -> one justified HTTP release.
{"raw_unjustified_calls":1,"governed_revoked_calls":0,"control_justified_calls":1}
```

The default proposal is a deterministic tool-call replay, not a measured LLM
failure. To obtain the proposal from an OpenAI model before the registry changes:

```bash
export OPENAI_API_KEY='your-key'
export OPENAI_MODEL='your-supported-model'
node examples/raw-vs-governed/run.js --live-model
```

Live mode makes one model request and may incur cost. It forces the fictional
`release_document` tool, validates its arguments, and reuses that exact proposal
for both executor paths. It demonstrates the execution gap for a pending call;
it does not test whether a model would voluntarily discover revocation. The model
sees the T0 registry state. Both paths run after the same revocation; only the
guarded path evaluates current evidence before execution.

## The boundary to copy

```js
const { guardedExecute } = require('./examples/raw-vs-governed/guard');
const result = await guardedExecute({
  baseUrl, packet, execute: () => releaseDocument(proposal.arguments),
});
```

`packetFor` shows how the host supplies the proposed consequence, historical
claim, current registry observation, revision, and accountable parties. It sends
no desired verdict. The reference evaluator produces the receipt; the adapter
owns the decision to invoke the executor. `guard.js` accepts only a matching
public-reference `stable / admissible=true / allow` receipt and fails closed for
errors, malformed responses, escalation, or constraints. A constrained receipt
requires a separate implementation of its actual constraints, not a silent allow.
The wire terms are preserved: `blocked / deny` is not rewritten as a production
`REFUSED` receipt or a fabricated `BLOCK` field.

## What this demonstrates

This is a new, synthetic NDA revocation integration example, inspired by authority
history scenarios. It is **not** a reproduction of the frozen V3 NDA examination,
a sanctions-compliance implementation, or new production validation evidence.
The public reference evaluator detects the represented conflicting state through
its published reference logic. The sovereign runtime is not included.

The HTTP sink intentionally accepts a release even after revocation, exposing
the gap a downstream executor can create. It stores fictional identifiers only;
no document, payment, or email leaves the machine. The unchanged-authority
control is an independent trial, not authority restored after revocation.

The adapter is an integration teaching example, not a production authorization
SDK. Packet ID matching is not cryptographic receipt verification. Production
integration must bind authenticated current authority evidence and the exact
immutable action to a verified receipt, enforce freshness and single-use
execution, and handle authoritative change between evaluation and consequence
at the actual execution boundary. This demo supplies the registry change before
evaluation; it does not solve every possible later race or discover unreported
changes. Every effect-capable path must pass the boundary for enforcement to hold.

## Verify

```bash
node --test examples/raw-vs-governed/guard.test.js
node examples/raw-vs-governed/run.js
```

These checks cover blocked, escalated, constrained, mismatched, malformed,
nonreference, unavailable, HTTP-error, invalid-JSON, and explicit-allow responses,
plus real local HTTP consequence counts in the demo. Live model mode is optional
and is not exercised by the offline checks.
