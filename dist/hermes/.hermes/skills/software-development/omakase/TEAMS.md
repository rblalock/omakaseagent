# Omakase Teams & Personas

This document defines the canonical structure for Omakase teams and sub-personas.

## Philosophy

- Work is organized into **Teams**.
- Each team has exactly one **Lead**.
- From outside the team, you only ever speak to the Lead.
- Inside the team, the Lead may delegate to internal sub-personas.
- Every persona (lead or member) **inherits** the full Omakase core principles (Rules + Critique Rubric + taste philosophy).
- Teams and personas are defined as markdown with YAML frontmatter for portability across agent harnesses.

## Canonical Frontmatter

```yaml
---
name: short-kebab-case-name
team: Team Name
lead: The Lead Name
role: lead | member
description: One-sentence purpose. This is the primary signal for automatic delegation in harnesses like Cursor and Claude Code.
inherits: omakase-core
model: inherit | specific-model-id
tools: optional-allowlist
readonly: true | false          # Recommended for reviewers, auditors, explorers
is_background: true | false     # For long-running work that shouldn't block
subagent: true                  # Signal that this should be treated as a native sub-agent when possible
invocation: task | skill | context
permissionMode: default | plan | acceptEdits | bypassPermissions   # Claude Code style
---
```

### Required Fields
- `name`
- `team`
- `lead`
- `role` (`lead` or `member`)
- `description`
- `inherits: omakase-core`

### Optional Fields
- `model`
- `tools`

## Team Model

- **External interface**: Only the team Lead is addressable from outside the team.
- **Internal delegation**: The Lead may delegate to sub-personas within the same team.
- **Handoffs between teams**: Explicit and documented in each Lead’s “Known Teams & Handoff Guidance” section.
- **Inheritance**: All teams and sub-personas receive the full `omakase-core` at build/packaging time.

## Current Teams (MLP)

| Team         | Lead            | Primary Invocation       | Purpose |
|--------------|-----------------|--------------------------|---------|
| Engineering  | The Engineer    | `@omakase-engineer`      | Implementation, review, refactoring, debugging, architecture |
| Archives     | The Archivist   | `@omakase-archivist`     | Memory, decisions, synthesis; git recap & chat preferences (`reference/archivist-workflows.md`) |
| Critics      | The Critic      | `@omakase-critic`        | Cross-cutting quality enforcement and judging |

**Fallback** (no native agents installed): `/omakase-router plan`, `/omakase-router taste`, `/omakase-router handoff` — not for lead work. See `reference/native-agents.md`.

## Sub-Personas Inside Teams

Sub-personas are only invocable by their team’s Lead. They are never addressed directly from outside the team.

Example (inside Engineering):

- The Senior Reviewer
- The Refactor Specialist

Example (inside Critics):

- The Deslop Critic
- The Structural Critic
- The Verification Critic
- The Skill Judge (SKILL.md / skill-package audits; see `reference/skill-judge.md`)

## Naming Conventions

- Team Leads: Always “The X” (e.g., The Engineer, The Critic, The Archivist)
- Internal sub-personas: “The X” style when possible (e.g., The Deslop Critic, The Senior Reviewer)
- Keep names to two words where practical.

## Adding New Teams or Sub-Personas

1. Create the directory under `skill/teams/<team-name>/`
2. Create `lead.md` with the canonical frontmatter + “Known Teams” and “Internal Sub-Personas” sections.
3. Add sub-personas under `sub-personas/` as needed.
4. Update the main `SKILL.md` router if the team should be directly invocable.
5. Ensure the new team’s Lead references `omakase-core` (it will be injected at build time).
6. Update this document and any relevant sections in `SKILL.md`.

All new teams and personas must inherit the full Omakase principles.

## Testing & Cleanup

For development and cross-harness testing, use the `omakase-test` installation path when available. This installs under a clearly removable namespace so it can be cleaned up in one command across all supported harnesses.

## Native Sub-Agent Registration (Harness Specific)

`omakase init` and `omakase skills install` (native agents on by default) emit **first-class agent files** generated from this directory:

| Harness | Lead agents (user-invokable) | Specialists (lead-only) |
|---------|------------------------------|-------------------------|
| OpenCode | `.opencode/agents/omakase-engineer.md` etc. | Same dir, `hidden: true` |
| Cursor / Claude | `.cursor/agents/`, `.claude/agents/` | `omakase-*` with internal-only descriptions |
| Codex | `.codex/agents/omakase_*.toml` | TOML with internal-only descriptions |
| Skill fallback | `.agents/skills/omakase/teams/` | Loaded by lead via Task, not direct user entry |

**Naming:** all native agents use the `omakase-` prefix (Codex: `omakase_engineer`).

**Archivist examples:** `@omakase-archivist` — “Weekly recap of my commits on main”; “What did I ship since Monday?”; “Mine last week’s chats for durable preferences — propose taste patches, confirm before apply.”

**Entry model:** users invoke **leads only** (`@omakase-engineer`, `@omakase-critic`, `@omakase-archivist`). Specialists are delegated by leads via the platform `Task` tool. The `SKILL.md` router is a thin fallback when native files are missing.

## Related Documents

- `core/omakase-core.md` — The injected core principles
- `SKILL.md` — Main router and team loading logic
- `reference/init.md` — How `omakase init` scaffolds teams and AGENTS.md
- `OMAKASE-RULES.md` + `OMAKASE-CRITIQUE.md` — The actual rules and rubric (injected via omakase-core)