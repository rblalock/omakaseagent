# Native Omakase Agents

Portable reference (shipped with the skill). Full doc: `docs/NATIVE-SUBAGENTS.md` in the repo.

## Install

```bash
npx omakaseagent init
```

## User-facing leads

| Agent id | Use for |
|----------|---------|
| `omakase-engineer` | Implementation, architecture, refactoring |
| `omakase-critic` | Quality enforcement, critique |
| `omakase-archivist` | Memory, decisions, synthesis; git recap & chat preferences (`reference/archivist-workflows.md`) |

## Invoke

| Harness | Command |
|---------|---------|
| OpenCode | `opencode run --agent omakase-engineer "…"` |
| Grok Build | `grok --agent omakase-engineer "…"` |
| Claude | `claude -p --agent omakase-engineer "…"` |
| Cursor | `@omakase-engineer` |
| Codex | `codex exec -c 'agent="omakase_engineer"' "…"` |

## Delegation (leads only)

Task → `subagent_type` from the lead’s delegation list (e.g. `omakase-senior-reviewer`, `omakase-skill-judge`). See each lead agent file.

Specialists are **INTERNAL ONLY** — not user-facing.

## Skill router (fallback)

This install includes skill **`omakase-router`** at `.agents/skills/omakase/SKILL.md` (folder name `omakase`).

Use for: `/omakase-router plan`, taste, handoff — **not** for `@omakase-engineer`.

## Verify

```bash
npm run verify:native-agents
```