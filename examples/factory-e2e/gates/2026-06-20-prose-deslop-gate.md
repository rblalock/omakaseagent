# Gate: Prose anti-slop extensions (stop-slop adapted)

**Date:** 2026-06-20  
**Risk class:** 2 (`skill/`, `scripts/build.js`)  
**Orchestration:** Engineer implementation → self-critic → this gate

## Seed

Add a writing counterpart to `reference/engineering.md`: phrase/structure catalogs and baseline rules for all agents, with additive merge rules for critique and plan on prose-heavy work. Wire prose deslop through omakase-core, router, Critics (Deslop Critic code/prose/mixed modes), Engineering, Archives, handoff, and dist bundles. Attribute catalogs to [stop-slop](https://github.com/hardikpandya/stop-slop) (MIT); keep Omakase taste overrides — no zero-adverb or zero-em-dash absolutism.

## Scenarios

- Existing `level4-checkpoint` and native-agent scenarios unchanged — prose rules apply at write time, not as new eval fixtures
- Deslop Critic gains explicit **code / prose / mixed** mode selection; mixed work merges engineering extensions for code sections and prose extensions for writing sections
- `reference/handoff.md` and engineer/archivist leads require baseline prose on handoffs, gate sections, and memory updates

## Mechanical evidence

All run at PR #17 merge revision (`fb3fa4e`), all exit 0 through `verify:pr-gate-diff` predecessor steps:

```
npm run build                  # reference/prose.md in all dist skill bundles; build.js copies new reference
npm run verify:native-agents   # 24 checks passed (grok bundle includes prose reference)
npm run verify:learn           # factory.md planned; stack detects Omakase
npm run verify:gate-reports    # all gates pass heading contract (this report added retroactively)
npm run verify:pr-gate-diff    # Class 2 paths covered by this gate
npm run verify:scenario-evals  # existing evals pass
npm run verify:drift           # TEAMS.md + dist lead bundles aligned
npm run verify                 # full chain
```

**Class 2 paths in scope (15):** `scripts/build.js`, `skill/SKILL.md`, `skill/core/omakase-core.md`, `skill/reference/{critique,engineering,handoff,plan,prose}.md`, critics/engineering/archives team leads and deslop/senior-reviewer/implementation-lead/memory-synthesizer sub-personas.

## Critic

Internal critique pass: no P0/P1.

- Prose baseline applies to **all** agents via omakase-core — not critic-only; matches engineering deslop pervasiveness
- stop-slop catalogs adapted, not copied wholesale: taste.md overrides preserved; no absolute adverb/em-dash bans
- Deslop Critic mode split avoids prose rules polluting pure code review and vice versa; mixed mode requires explicit domain declaration
- P2: large phrase catalog in `reference/prose.md` — acceptable as reference material; agents load progressively via merge rules, not full paste into every turn
- P3: PR merged before this gate landed; CI failed on `verify:pr-gate-diff` (runs #72–#73) — gate added in follow-up commit

## Memory consulted

- `taste.md` — senior voice, no AI slop; prose rules reinforce existing taste, do not replace it
- `decisions.md` — dark factory Level 4; Class 2 skill changes require gate evidence (this report)
- `reference/engineering.md` — structural parallel for code deslop; prose.md mirrors pattern for writing

## Risks / human decision

- **Catalog drift:** stop-slop upstream may evolve; periodic diff review recommended, not automated sync
- **Over-application:** agents must use merge rules in critique/plan — engineering-only tasks should not load full prose extensions as primary lens
- **Human checkpoint:** Accept `reference/prose.md` as the canonical prose deslop reference and Deslop Critic tri-mode behavior