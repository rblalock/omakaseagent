<div align="center">

<a href="https://omakaseagent.com"><img src="https://omakaseagent.com/og.png" alt="Omakase Agent: the chef's standard for AI agent work" width="720"></a>

**The chef's standard.** One skill. Craftsman's taste. Zero AI slop.

[omakaseagent.com](https://omakaseagent.com)

[![npm](https://img.shields.io/npm/v/omakaseagent?color=d93a1f&label=npm)](https://www.npmjs.com/package/omakaseagent)
[![license](https://img.shields.io/badge/license-Apache--2.0-2a221b)](LICENSE)
[![skills.sh](https://skills.sh/b/rblalock/omakaseagent)](https://skills.sh/rblalock/omakaseagent)

</div>

Trust the chef — state the goal. Omakase applies the bar, remembers taste, and critiques before anything significant ships.

## What it is

Omakase is a **portable quality standard** for agent work: twelve rules, a critique rubric, and project memory (`.omakaseagent/taste.md`, `decisions.md`). Not a bag of prompts.

Generic, hedging, over-engineered output fails. Non-trivial work explains *why* this approach.

## Quick start

Paste this into your agent (Claude Code, Cursor, wherever it lives) — the setup is agentic, not a script:

```text
Run `npx omakaseagent init` in this repo. Then read the AGENTS.md and Omakase
skill it installs, and adopt the twelve rules and the critique gate for all
work here from now on. Next, run `npx omakaseagent learn` and fill in
.omakaseagent/factory.md with this repo's real build, test, and verify
commands. When you're done, tell me what standard you're now working under
and how I should hand you tasks.
```

Prefer the terminal? `npx omakaseagent init` then `npx omakaseagent learn` — but the agent should be the one reading and adopting what gets installed.

Reload your harness, then talk to a **lead** (not a menu of skills):

| Harness | Example |
|---------|---------|
| Cursor / Claude Code | `@omakase-engineer add rate limiting with backoff` |
| OpenCode | `opencode run --agent omakase-engineer "add rate limiting…"` |
| Grok | `grok --agent omakase-engineer "…"` |
| Claude CLI | `claude -p --agent omakase-critic "review the auth module"` |

**Leads:** `@omakase-engineer` · `@omakase-critic` · `@omakase-archivist` — specialists stay internal; leads delegate.

**Router skill** (`omakase-router`) is only for plan, taste, handoff, and init when you are not using a native lead:

```
/omakase-router plan <goal>
/omakase-router critique <target>
```

Harness quirks, Codex names, and troubleshooting: [docs/NATIVE-SUBAGENTS.md](docs/NATIVE-SUBAGENTS.md).

## The standard (always loaded)

| File | Role |
|------|------|
| [OMAKASE-RULES.md](OMAKASE-RULES.md) | Twelve non-negotiable rules |
| [OMAKASE-CRITIQUE.md](OMAKASE-CRITIQUE.md) | Rubric for major output |
| [OMAKASE-PRINCIPLES.md](OMAKASE-PRINCIPLES.md) | Why this is a standard, not a prompt pack |

Memory lives in `.omakaseagent/` after `init`.

## Install

**New project:**

```bash
npx omakaseagent init
```

**Skill + agents only** (harness already configured):

```bash
npx omakaseagent skills install          # auto-detect harness
npx omakaseagent skills install cursor   # or: claude | agents | grok | codex
```

Also on the skills ecosystem: `npx skills add rblalock/omakaseagent` ([skills.sh](https://skills.sh/rblalock/omakaseagent)).

Use `npx omakaseagent skills install --no-native-agents` for skill-only. Verify artifacts: `npm run verify:native-agents`.

## Developing this repo

Source: `skill/`. Shipped bundles: `dist/` (committed — do not edit by hand).

```bash
npm link              # local CLI
npm run build
npm run verify:native-agents
npx omakaseagent init      # dogfood in this clone
npx omakaseagent learn     # factory layout for this repo
```

## License

Apache 2.0