# Gate: Post-merge factory thorough test + fixes

**Date:** 2026-06-06  
**Risk class:** 1 (CI + learn script)  
**Tester:** Cloud agent (factory dogfood)

## Seed

Verify merged `omakase learn` + factory docs work end-to-end on omakaseagent and a minimal repo; fix gaps found.

## Scenarios exercised

| Scenario | Result |
|----------|--------|
| init → learn on empty Node repo (`/tmp/factory-test-repo`) | PASS — factory.md, 2 scenarios |
| learn without init | PASS — exits 1 with clear error |
| learn --dry-run idempotency | PASS — no duplicate scenario files |
| Fresh init → learn on omakaseagent | PASS — 4 scenarios, factory.md |
| Factory Class 1 loop (this change) | PASS — see mechanical evidence |

## Mechanical evidence

```
npm run build                 — exit 0
npm run verify:native-agents  — exit 0
npm run verify:learn          — exit 0
node bin/omakase.js learn     — factory.md lists verify:learn after fix
```

## Fixes from test

1. `mechanicalChecks` — discover all `verify:*` scripts (was missing `verify:learn`)
2. CI — add `npm run verify:learn` step
3. Native `omakase-engineer` — `{file:}` include `reference/task-intake.md` so intake protocol is always in context

## Critic / gaps remaining

| Severity | Gap |
|----------|-----|
| P2 | `dark-factory.md` not `{file:}`-included on engineer (summary inline in lead only) |
| P2 | No CI check that Class 2+ PRs include gate files (dark-factory Phase 3) |
| P2 | Task series not orchestrated — user invokes lead per task (by design v1) |
| P3 | `examples/factory-dogfood` can drift from live learn — refresh on learn changes |

## Memory consulted

- `.omakaseagent/taste.md` — dark factory bullets, dist edit policy
- `factory.md` — mechanical evidence list

## Human decision

Accept if CI green and factory.md lists all verify scripts.
