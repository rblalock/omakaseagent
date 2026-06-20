# Handoff — Clean Protocol

When work moves from one agent (or person) to another, a high-quality handoff is mandatory (Rule 6).

## Required Elements

Every handoff must include:

1. **Goal restatement** (in the recipient's terms)
2. **Context that matters** (only what the next party needs — no dump)
3. **Decisions made + Why** (link to or excerpt from `decisions.md` when relevant)
4. **Current state** (what exists, what works, what is known to be broken or incomplete)
5. **Open questions / risks / assumptions**
6. **Recommended next actions** (prioritized, with rationale)
7. **How to verify success** (observable criteria)

## Tone & Density

- Direct. No motivational language.
- High signal-to-noise. If a sentence does not change what the recipient should do or know, delete it.
- Use the same "Why this approach" standard as engineering work.
- Apply `reference/prose.md` Baseline — handoffs are prose; no throat-clearing, binary contrasts, or false agency.

## When to Produce a Handoff

- Explicit `/omakase-router handoff`
- Before switching to a different persona or sub-agent
- At natural phase boundaries (plan → implement, research → build, etc.)
- When the current agent is stopping and expects another to continue

## Storage

Save substantial handoffs to `.omakaseagent/handoffs/` with a clear slug (date + topic). This builds institutional memory over time.

The recipient should be able to pick up the work with minimal back-and-forth.

## Execution plans vs handoffs

| Artifact | When |
|----------|------|
| **Handoff** (`handoffs/`) | Session continuity, context between agents mid-task |
| **Execution plan** (`backlog/`) | Scoped implementation spec — steps, STOP, verify gates (`reference/execution-plan.md`) |

After a backlog audit, a short findings summary may live in `handoffs/`; durable work specs go to `backlog/`. Implementation always follows factory orchestration — an execution plan is not a substitute for critic + gate on Class 2+.
