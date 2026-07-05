# Task intake — agents co-create the factory setup

Users say goals in plain language ("add rate limiting", "fix the CI flake"). **They should not need to know "seed", risk classes, or gate file paths.** Leads set that up.

## Why intake exists

The factory pattern (see `reference/dark-factory.md`) tries to **replace routine diff review with proof**. Your job at intake: turn a vague ask into an approvable brief + evidence plan so the human can say yes once, then judge **evidence at the end** — not every file during implementation.

**You are not building a runner.** You are setting up **what must be proven** and **which commands prove it**.

**Read first:** `reference/dark-factory.md` (goals + what automation means), `.omakaseagent/factory.md` (this repo's checks), `taste.md`, `decisions.md`. Ambiguous goals: run **`reference/fog-of-war.md`** before the brief — built-in, not a slash command.

## If factory is missing

On first significant task in a repo without `factory.md`:

1. Tell the user briefly: Omakase works best with a one-time repo setup.  
2. Prefer CLI: `npx omakaseagent init` then `npx omakaseagent learn` (or `learn --dry-run`).  
3. If CLI unavailable: `@omakase-archivist` or router `learn` per `reference/learn.md` — propose artifacts, confirm before write.  
4. **Do not block Class 0–1 trivia** (typo in README) on full factory — still cite memory if present.

## Intake protocol (Engineer — start of non-trivial work)

Replace jargon with a short **Task brief** the user can skim in one screen.

### 0. Fog check (when ambiguous)

If the ask is underspecified, taste-heavy, reference-driven, or Class 3+ — run the quadrant walk in **`reference/fog-of-war.md`** first. Deliver the four-quadrant map, then draft the brief from it. Skip for Class 0–1 with a clear ask.

### 1. Infer from the request (do not interrogate)

From the user message + repo context (and the fog map when you ran step 0), draft:

| Field | Agent fills |
|-------|-------------|
| **Goal** | What should be true when done |
| **Non-goals** | What we are not doing |
| **Observable behavior** | What a human or test would see |
| **Risk class** | 0–3+ using `factory.md` or `dark-factory.md` defaults |
| **Evidence plan** | Commands from `factory.md` mechanical list + scenarios if Class 2+ |

Show the brief under a heading like **Task brief** (not "Seed" unless the user is technical).

### 2. When to ask the user (minimal)

| Situation | Action |
|-----------|--------|
| Class 0–1, clear ask | Brief inline → proceed |
| Class 2+, clear ask | Brief + propose 1–3 scenarios (new or link existing in `.omakaseagent/scenarios/`) → **one** confirm: "Proceed with this brief?" |
| Ambiguous goal, conflicting constraints, Class 3+ | Fog-of-war walk (`reference/fog-of-war.md`) → brief → confirm before implementation |
| User already gave a full spec | Brief is confirm-only or skip if redundant |
| User points at `.omakaseagent/backlog/NNN-*.md` | Treat execution plan as charter; brief is plan summary + risk class; proceed to scenarios (Class 2+) then factory loop |
| Run arrives via `.omakaseagent/loops/<slug>.md` | Standing intent — no per-iteration confirm; execute exactly one iteration per `reference/loops.md`; halt and record instead of asking |

Never ask the user to "create a seed file." You create the brief; they approve or correct.

### Backlog execution plans

When implementing from `.omakaseagent/backlog/`:

1. Read the full execution plan (`reference/execution-plan.md` shape).
2. Task brief = plan title + why + done criteria excerpt.
3. Run drift check from plan header before editing source.
4. Honor STOP conditions — escalate to user, do not improvise.
5. Gate report must link the backlog plan path and record done-criteria results.

### 3. Scenarios (Class 2+)

- Reuse existing scenario files when they cover the work.  
- If gaps exist, **draft** `.omakaseagent/scenarios/<slug>.md` and show content; write file after confirm (or on proceed if user said "ship it").  
- Keep scenarios short: actor, start, action, observe, must-not, evidence.

### 4. Work between gates

Proceed with implementation per Engineering lead. Run mechanical checks from `factory.md`. Delegate critic when appropriate.

### 5. Close with a gate report (not chat-only "done")

Write `.omakaseagent/gates/<date>-<slug>-gate.md` using headings from `reference/learn.md`. Tell the user the path.

For Class 0–1, a **light checkpoint** in the reply is enough; full gate file optional unless taste requires it.

### 6. Plain-language close

End with what changed, what was verified, and **one decision** if the human must accept/reject — not a lecture on Level 4.

## Other leads

| Lead | Intake role |
|------|-------------|
| **Critic** | Reviews evidence stack in gate reports; does not replace intake |
| **Archivist** | `learn`, memory, chat/git workflows; may draft factory artifacts |

## Anti-patterns

- Waiting for the user to say "seed" or "risk class"  
- Long factory terminology up front  
- Skipping mechanical evidence when `factory.md` lists commands  
- "Done" without verification or gate artifact on Class 2+
