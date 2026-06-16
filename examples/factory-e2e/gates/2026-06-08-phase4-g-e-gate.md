# Gate: Phase 4 scenario evals + Phase G project agents + Phase E drift

**Date:** 2026-06-08  
**Risk class:** 2 (skill/, reference docs) + 1 (verify scripts, evals/)  
**Orchestration:** Engineer implementation → self-critic → this gate

## Seed

Ship dark-factory Phase 4 (scenario evals), Phase G (project agents on learn), Phase E (team-architecture + drift). Archive deferred expansion phases A/B/F.

## Scenarios

- `npm run verify:scenario-evals` — 6 eval contracts pass against `skill/` + dist engineer
- `npm run verify:drift` — TEAMS.md + dist lead bundles aligned
- `omakase learn --dry-run` — proposes project-agents for skill + CLI signals


## Mechanical evidence

```
npm run build
npm run verify:native-agents
npm run verify:learn
npm run verify:gate-reports
npm run verify:pr-gate-diff
npm run verify:scenario-evals
npm run verify:drift
```

## Critic

Pass — mechanical evals encode prior failure modes without live LLM harness. Project agents capped at 3; emit only when harness dirs exist. No P0/P1.

## Memory consulted

- dark-factory.md Phase 4 eval list
- expansion plan — defer Sales/ship until factory evals stable

## Risks / human decision

- **Live evals** (with-skill vs baseline) remain Phase 5 — specs are contract-only today.
- **Project agent emit** writes to local harness dirs — gitignored; dogfood snapshot under `examples/factory-dogfood/`.

**Human checkpoint:** Accept eval + project-agent + drift stack.
