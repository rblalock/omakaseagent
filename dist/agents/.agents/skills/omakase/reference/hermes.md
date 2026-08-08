# Omakase on Hermes Agent

Hermes does not use Cursor/Claude-style `@agent` files. Omakase ships as **skills** under `$HERMES_HOME/skills/`.

## Installed surfaces

| Skill | Role |
|-------|------|
| `omakase` | Router + standard (plan, taste, handoff, init, smart chef) |
| `omakase-engineer` | Engineering lead |
| `omakase-critic` | Critics lead |
| `omakase-archivist` | Archives lead |

Install / refresh:

```bash
# from omakaseagent repo after npm run build
node bin/omakase.js skills install hermes --global

# or if published CLI has hermes target:
omakase skills install hermes --global
```

Uses `HERMES_HOME` if set, else `~/.hermes`.

## How to invoke

1. **User asks for engineer / critic / archivist work** → load the matching skill (`skill_view` / session preload).
2. **Plan / taste / handoff / init** → load `omakase` and follow the command router.
3. **Significant deliverable** → always run the critique gate (`OMAKASE-CRITIQUE.md`).

## Delegation on Hermes

Native `Task` / `subagent_type` is **not** available. Leads delegate via Hermes:

```
delegate_task(
  goal="<specialist charter>",
  context="<paste relevant excerpts from .omakaseagent/ + task>"
)
```

Map specialists by loading their persona files from the `omakase` skill package:

| Lead | Specialist file paths under skill `omakase` |
|------|-----------------------------------------------|
| Engineer | `teams/engineering/sub-personas/*.md` |
| Critic | `teams/critics/sub-personas/*.md` |
| Archivist | `teams/archives/sub-personas/memory-synthesizer.md` |

When delegating: `skill_view(name='omakase', file_path='…')` for core + persona, then give the child a tight goal. Children should not re-open the full router unless needed.

## Loading package files

From skill `omakase`:

```
skill_view(name='omakase')                          # SKILL.md
skill_view(name='omakase', file_path='OMAKASE-RULES.md')
skill_view(name='omakase', file_path='OMAKASE-CRITIQUE.md')
skill_view(name='omakase', file_path='reference/plan.md')
skill_view(name='omakase', file_path='teams/engineering/lead.md')
```

Hermes lists `references/` (plural) as linked_files by convention; this pack uses `reference/` (singular). Always use explicit `file_path`.

## Project memory

Same as other harnesses:

- `.omakaseagent/taste.md`
- `.omakaseagent/decisions.md`

Consult on significant work. Seed on first serious task if missing (`reference/init.md`).

## Reload

Skill index is session-cached. After install/update, **start a new Hermes chat** (or restart desktop) to see new skills.
