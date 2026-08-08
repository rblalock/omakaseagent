# Team architecture patterns (Harness vocabulary, Omakase mapping)

One-page reference for **when to delegate how**. Siphoned from [revfactory/harness](https://github.com/revfactory/harness) agent-design patterns — Omakase is a **curated** instance, not a harness generator.

## Six patterns

| Pattern | Meaning | Omakase today |
|---------|---------|---------------|
| **Pipeline** | Stages in order | `plan` → Engineer work → Critic → Archivist memory |
| **Expert Pool** | Lead picks specialist by signal | Engineer → implementation-lead / debugger / refactor; Critic → deslop / structural / skill-judge |
| **Producer–Reviewer** | Build then independent review | Engineer implements → **@omakase-critic** on significant work |
| **Fan-out / Fan-in** | Parallel work, merged result | Parallel Task to specialists; Critic synthesizes findings |
| **Supervisor** | Lead owns DAG, not every line | **@omakase-engineer** orchestrates specialists |
| **Hierarchical** | Nested leads | **Avoid** — Omakase stays flat: user talks to leads only |

## Omakase defaults

- **User invokes leads only:** `@omakase-engineer`, `@omakase-critic`, `@omakase-archivist`
- **Significant work:** Producer–Reviewer when independent critique helps
- **Imports / skills:** skill-judge (Critics) before merging external SKILL.md
- **Handoffs:** `.omakaseagent/handoffs/` for multi-step continuity when useful

## Trigger evals (skill activation)

From Harness skill-testing — apply with **skill-judge** and **scenario evals** (`evals/*.eval.json`):

| Should activate | Should NOT activate (near-miss) |
|-----------------|----------------------------------|
| "Ship this PR", "fix CI", "refactor X" | "Write launch email copy" (no engineering extensions) |
| "Critique this skill", "audit SKILL.md" | "Summarize this article" (not skill-judge) |
| "What did I ship last week" | "Implement feature Y" (Archivist, not Engineer) |
| Non-trivial product change | Typo fix in README |

**With-skill vs without-skill:** For a new persona or router change, run the same prompt twice (native lead present vs absent) and compare: memory citation, domain declaration. Mechanical contract: `npm run verify:scenario-evals`.

## Drift

Archivist maintenance: `npm run verify:drift` — `skill/teams/` vs `dist/*/agents/` vs `TEAMS.md`. Re-run after `npm run build` when personas change.
