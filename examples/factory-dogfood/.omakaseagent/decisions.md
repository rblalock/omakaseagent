# Key Decisions

## 2026-06-05 — Omakase Standard Adopted
**Context**: Project initialized with `omakase init`.
**Decision**: Adopt Omakase Rules + Critique Rubric. Use native team leads as primary entry points; specialists are lead-delegated only.
**Why**: Establishes persistent taste memory and senior quality bar from day one.
**Revisit if**: Team changes standards or moves off Omakase.

## 2026-06-05 — Dark factory bootstrapped
**Context**: `omakase learn` on this repo.
**Decision**: Adopt Level 4 layout (factory.md, scenarios, gates, handoffs). Class 2+ uses scenarios + gate reports.
**Why**: Humans review intent and evidence, not every diff; Omakase principles already define the bar.
**Revisit if**: Stack or CI changes materially — re-run `omakase learn`.

## 2026-06-12 — Loop ladder adopted
**Context**: [Loopcraft review](https://www.latent.space/p/ainews-loopcraft-the-art-of-stacking) — stacking loops on the Level 4 factory.
**Decision**: Adopt the L0–L4 loop ladder and standing charters in `.omakaseagent/loops/` (`reference/loops.md`). Unattended runs require an approved charter; one gate per iteration; upshift only via a human-approved decisions.md entry; no orchestration engine — runners are external (BYO).
**Why**: Takes the human out of the iteration, not the checkpoint. Throughput scales by batching gate review; autonomy is earned via gate history, never assumed.
**Revisit if**: Charter adoption shows BYO runners are insufficient — then consider an `omakase loop` runner (`omakase status` shipped same day; see next entry).

## 2026-06-12 — omakase status shipped (read-only)
**Context**: Agent-success review of the loop deferrals — eligibility and Stop-condition checks are deterministic computation an agent was re-deriving from markdown every iteration.
**Decision**: Ship `omakase status` (read-only: approval, the charter's mechanical Stop conditions, next eligible item, exit codes for runners; plan-level STOP and drift stay agent-side). The loop **motor** stays BYO — `omakase loop` remains deferred; ledger and queue writes stay with the agent.
**Why**: Our own operating rule — repeatable checks get encoded, not re-judged. Deterministic picking makes the weakest model in the loop as safe as the most careful one.
**Revisit if**: Gate-history accumulates enough to automate upshift-streak proposals — `status` is the natural place to compute them.

