# Agentic factory test report (2026-06-06)

Simulated **user** flows across three repos under `/tmp/agentic-tests/`. Each scenario follows Engineer lead + `task-intake.md` as an agent would.

## Rubric used

Omakase Critique Rubric + factory gates (context loaded, scenario clarity, verification, checkpoint).

---

## Scenario A — `shop-api` (Class 2 feature)

**User says:** “Add a GET /health endpoint that returns `{ ok: true }`.”

**Setup:** `omakase init` → `learn` → factory lists `npm run test`.

| Step | Agent behavior | Pass? |
|------|----------------|-------|
| Task brief (no user jargon) | Goal, risk Class 2, evidence = npm test | ✓ |
| Scenario drafted | `scenarios/health-endpoint.md` | ✓ |
| Implement | Minimal route in `server.js` | ✓ |
| Verify | `npm run test` — 2 tests pass | ✓ |
| Gate | `gates/2026-06-06-health-endpoint-gate.md` | ✓ |

**Omakase principles:** Ruthless simplicity (no framework), pragmatic tests, evidence not chat-only done.

**Gap:** Real Cursor agent might skip gate without lead loaded; native engineer + task-intake mitigate.

---

## Scenario B — `docs-only` (Class 0)

**User says:** “Fix the typo in the README — Teh → The.”

**Setup:** `init` → `learn` (no mechanical checks detected — correct for empty scripts).

| Step | Agent behavior | Pass? |
|------|----------------|-------|
| Brief inline | Class 0, no scenario ceremony | ✓ |
| Fix | One-line README change | ✓ |
| Gate | Skipped (light checkpoint OK per intake) | ✓ |

**Omakase principles:** No over-ceremony on trivia.

**Gap:** `learn` on script-less repos shows “none detected” for mechanical evidence — agent should still sanity-read the diff; no automated proof.

---

## Scenario C — `cli-utils` (init without learn first)

**User says:** “Add a greet(name) helper with tests.”

**Setup:** `init` only → user task → agent runs `learn` when factory missing.

| Step | Agent behavior | Pass? |
|------|----------------|-------|
| Offer learn | factory.md absent → `learn` run | ✓ |
| Implement | `src/greet.js` + node:test | ✓ |
| Verify | `npm test` — 2 pass | ✓ |
| Re-learn | After adding test script, `learn` picks up `npm run test` | ✓ |

**Omakase principles:** Did not block on factory; bootstrapped then shipped with tests.

**Gap:** Gate file not written (Class 2-ish); agent should add gate on real harness — **intake compliance risk**.

---

## Cross-cutting findings

| Finding | Severity | Notes |
|---------|----------|-------|
| Engineer must be invoked (`@omakase-engineer`) | P1 | Router/smart-default won't reliably run intake |
| `task-intake` on native engineer (PR #5) | Fixed | Always in context for Cursor/OpenCode |
| `verify:*` in factory.md (PR #5) | Fixed | learn discovers all verify scripts |
| Docs-only repos: no mechanical checks | P2 | Expected; evidence is diff-only |
| Class 2 without gate (scenario C) | P2 | Protocol says gate; discipline not enforced in CI |
| Series of tasks | — | User invokes lead per task; no queue runner |

## Verdict

**Factory setup (`learn`) + disciplined Engineer behavior works agentically** when the lead follows intake: plain user asks → brief → work → proof → gate (Class 2+).

**Does not yet enforce itself** — depends on persona load and agent discipline; Phase 3 CI on gates would help.

**Meets Omakase principles** when executed as designed: simplicity, evidence, memory cite, no slop in test implementations, appropriate ceremony by risk class.
