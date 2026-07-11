# AGENTS

## Omakase Standards

This project follows the [Omakase](https://github.com/rblalock/omakaseagent) standard — senior craftsmanship, zero AI slop, mandatory critique.

**Native agents (primary entry points):**
- `@omakase-engineer` — implementation, architecture, refactoring
- `@omakase-critic` — quality enforcement and review
- `@omakase-archivist` — memory and decisions

Specialists (`omakase-senior-reviewer`, `omakase-skill-judge`, etc.) are internal — invoked by leads via Task, not directly.

**Memory:** `.omakaseagent/taste.md` and `.omakaseagent/decisions.md`

**Fallback router:** `/omakase-router plan` / `/omakase-router taste` (skill `omakase-router` in `.agents/skills/omakase/`) — not for lead work.
