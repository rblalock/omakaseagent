# Write skills — authoring reference (built-in, not a slash command)

Use when creating or revising `SKILL.md`, persona markdown under `skill/teams/`, `skill/reference/`, or project agents. **@omakase-critic** may delegate to **omakase-skill-judge** for scored audits; this file is the **edit bar** fixes must obey.

A skill is compressed operational memory — **predictability** (same process every run), not identical output. Put only context that changes what the agent will do.

**Lineage:** Principles adapted from [dzhng/skills `write-skills`](https://github.com/dzhng/skills) (MIT). Evaluation rubric: `reference/skill-judge.md`.

---

## First principles

1. **Trigger from the description.** Frontmatter `description` is the only part read before load. State what the skill does and the concrete situations that trigger it. Never hide triggers in the body.

2. **Spend tokens like they are scarce.** Keep non-obvious workflow, domain constraints, tool choices, failure modes, and validation rules. Delete background, motivation, and generic advice the model already knows.

3. **Write procedures, not essays.** Imperative rules, decision points, small examples. Match procedure shape to deliverable shape — an interview or staged walk must *be* that shape in the workflow steps.

4. **Progressive disclosure.** Short main file; push long schemas, provider docs, and variant guidance to linked `reference/` files loaded on pointer. Repeatable fragile ops → `scripts/`. Reusable output templates → `assets/`.

5. **Validate by use.** A skill is good when a fresh agent applies it correctly on a realistic task — blind run, weakest model that will run it. After editing, read as if you had no conversation history; delete anything that would not change action.

6. **Examples document the problem, not the solution.** Teach the smell and symptom; let the agent derive the fix against current code. Baked-in fixes rot.

---

## Leading words

A **leading word** is a compact concept in pretraining that anchors behavior in few tokens (*fog of war*, *tracer bullets*, *red*, *tight*, *sediment*).

- Use the same word in **description** (activation) and **body** (execution).
- Hunt restatements a leading word retires: "fast, deterministic, low-overhead" → *tight*.
- Weak leading words are no-ops (`be thorough`). Prefer a stronger word (*relentless*) or delete.

---

## Information hierarchy

Rank each piece by how immediately the agent needs it:

1. **In-skill step** — ordered action in `SKILL.md`; ends on a **checkable** completion criterion (exhaustive where it matters: "every modified model accounted for").
2. **In-skill reference** — definition or rule consulted on demand; co-locate definition + rules + caveats under one heading.
3. **External reference** — `reference/<name>.md`, loaded only when a pointer fires.

**When to split by sequence:** Later steps tempt the agent to rush the current one (**stage compression**). Hide later steps behind "when you enter step N, read `reference/...`".

**When to split by invocation:** Distinct leading word should trigger alone, or another skill must reach it — you pay context load for a new always-loaded description.

---

## Failure modes (diagnose misbehaving skills)

| Mode | Smell | Fix |
|------|-------|-----|
| **Premature completion** | Step ends before done | Sharpen completion criterion first; split sequence only if criterion is irreducibly fuzzy |
| **Embargo** | Agent withholds early finding for choreography | State: order governs presentation, never disclosure |
| **Lucky pass** | Success only because user volunteered critical input | Encode the eliciting probe as an explicit step |
| **Duplication** | Same meaning in two places | Single source of truth |
| **Sediment** | Stale layers accumulated | Prune deliberately |
| **War story** | Play-by-play of one bug with function names | Principle + smell; one touchstone max |
| **Implementation index** | Line numbers, current literals, today's file paths | Durable principles; agent finds current owner in codebase |
| **Sprawl** | Too long even when every line is live | Ladder: disclose behind pointers, split by branch or sequence |
| **No-op** | Line the model already obeys | Delete the whole sentence — do not trim words |

Skill-level **done** must name the handover artifact when the job ends in one — otherwise runs stop at whichever intermediate artifact feels finished.

---

## Edit pass (creating or revising)

- Name: lowercase hyphen-case; folder name matches.
- Description: specific enough to trigger without the body.
- Remove "when to use" from body (belongs in description).
- Remove stale history, attribution blocks in body, placeholders, setup notes.
- Remove file paths, line numbers, current constants unless the skill is explicitly a navigation runbook.
- Prefer one strong rule over overlapping bullets.
- Refactor restatements into a leading word where one fits.
- No README/changelog unless the skill tells the agent when to read them.
- After persona edits: `npm run build`, `npm run verify:native-agents`, `npm run verify:scenario-evals` when in omakaseagent source.

---

## Default shape

```markdown
---
name: short-verb-phrase
description: What this does. Use when ...
---

# Title

One short paragraph defining the job.

## Workflow

1. First load-bearing step — done when [checkable].
2. Key decision.
3. Produce or verify artifact.

## Rules

- Constraints that prevent common mistakes.
- Link references only for conditional loads.
```

---

## Omakase-specific

- Personas: `description` is delegation signal; specialists are lead-delegated only unless native agent policy says otherwise.
- Project-scoped skills: say when to read/update `.omakaseagent/taste.md` and `decisions.md`.
- Factory Class 2+ skill changes: brief + scenarios + gate — same as any other repo change (`reference/factory-orchestration.md`).