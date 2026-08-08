# Task intake — turn a goal into a clear brief

Users state goals in plain language ("add rate limiting", "fix the CI flake"). They should not need to know internal jargon. Leads set up the work.

## Why intake exists

Turn a vague ask into a short **Task brief** the human can skim once, then prove the work with real checks — not by asking them to re-read every diff.

**Read first:** `.omakaseagent/taste.md`, `decisions.md`. Ambiguous goals: run **`reference/fog-of-war.md`** before the brief — built-in, not a slash command.

## If memory is missing

On first significant task without `.omakaseagent/`:

1. Prefer CLI: `npx omakaseagent init`.  
2. Or seed minimal memory per `reference/init.md`.  
3. Do not block trivial fixes (typo in README) on full init — still cite memory if present.

## Intake protocol (Engineer — start of non-trivial work)

### 0. Fog check (when ambiguous)

If the ask is underspecified, taste-heavy, or reference-driven — run the quadrant walk in **`reference/fog-of-war.md`** first. Deliver the four-quadrant map, then draft the brief from it. Skip when the ask is clear.

### 1. Infer from the request (do not interrogate)

From the user message + repo context (and the fog map when you ran step 0), draft:

| Field | Agent fills |
|-------|-------------|
| **Goal** | What should be true when done |
| **Non-goals** | What we are not doing |
| **Observable behavior** | What a human or test would see |
| **Evidence plan** | Build/test/verify commands that prove it (from package.json, CI, README) |

Show the brief under a heading like **Task brief**.

### 2. When to ask the user (minimal)

| Situation | Action |
|-----------|--------|
| Clear, small ask | Brief inline → proceed |
| Non-trivial but clear | Brief → one confirm if scope could surprise them |
| Ambiguous goal, conflicting constraints | Fog-of-war walk → brief → confirm before implementation |
| User already gave a full spec | Brief is confirm-only or skip if redundant |

### 3. Work

Implement per Engineering lead. Run the repo's real checks. Delegate **@omakase-critic** on significant work when an independent quality pass would help.

### 4. Close

End with what changed, what was verified (commands + outcomes), and any decision the human must make. Do not claim "done" without evidence on non-trivial work.

## Other leads

| Lead | Intake role |
|------|-------------|
| **Critic** | Independent quality pass; does not replace intake |
| **Archivist** | Memory, decisions, chat/git workflows |

## Anti-patterns

- Long ceremony before a clear fix  
- Skipping mechanical evidence when the repo has build/test/verify commands  
- "Done" without verification on non-trivial work  
- Inventing process the user never asked for  
