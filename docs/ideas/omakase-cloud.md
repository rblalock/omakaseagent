# Omakase Cloud — Full Vision

*Status: idea. Brainstorm outcome, 2026-07-08 — a vision document, not an implementation plan. Slicing into buildable increments is deliberately deferred.*

*Sources: [Vercel changelog — GitHub Tools for Eve](https://vercel.com/changelog/github-tools-eve), [Eve docs](https://eve.dev/docs), [GitHub agent guide](https://vercel.com/kb/guide/github-agent-eve), AI SDK HarnessAgent.*

## Context

Omakase today is a **standard, not a runtime**: markdown playbooks plus a zero-dependency file-copying CLI that installs the standard into whatever harness the user already runs. It deliberately has no hosted or big-cloud dependencies.

Vercel's **Eve** (filesystem-first TypeScript agent framework: durable sessions, channels, human-approval gates, skills-as-files) and the AI SDK's **HarnessAgent** (runs real harnesses — Claude Code, Codex, Pi — inside sandboxes with detach/resume) supply exactly the runtime omakase lacks. The tweet's pitch — "ship a software factory in 9 lines" — describes a *generic* factory. Omakase supplies what 9 lines can't: taste, gates, and a standard. `skill/reference/dark-factory.md` already specifies the factory's trust model; Eve is the missing executor.

**Thesis: Omakase stays the taste layer; Eve becomes a deployment target. The cloud contributes time, concurrency, independence, and scale — but zero memory. State lives in git. Kill the deployment, lose nothing.**

## Principles carried into the cloud

- **Git is the database.** All state remains in-repo under `.omakaseagent/` (taste, decisions, gates, factory config). Hosted components are stateless and swappable.
- **Self-deploy, not hosted-by-us.** `omakaseagent init --eve` scaffolds a project the user deploys with their keys ("the chef comes to your kitchen"). No Omakase-run service, no credential custody, no inference bill.
- **Single source of truth.** `skill/` remains the only authored standard. Eve is a sixth `dist/` target emitted by the existing `scripts/native-agents/generate.js` pipeline. No forked cloud implementation.
- **Zero-dep purity survives.** Eve/zod/github-tools dependencies live in the *scaffolded project's* package.json. The `omakaseagent` package keeps zero runtime deps; the CLI keeps just copying files.
- **Vercel is a target, not a dependency.** Eve runs on plain Node. Vercel Connect (OIDC creds) and `@ai-sdk/sandbox-vercel` are the lock-in points — the template keeps a GitHub App token/PAT credential path and a pluggable sandbox provider.

## Why the cloud at all — the value model

A local session is bounded four ways: your attention, your machine being awake, one thread of work, and acting only when spoken to. Each cloud value is a release from one of those bounds, ranked by conviction:

1. **The Pass turns a personal standard into a repo invariant.** Local omakase disciplines *your* agent — single-player. A hosted Critic as a required check disciplines *every PR*: teammates', dependabot's, other agents'. Nobody needs to run omakase to be held to the taste file. A teammate's sloppy PR gets a gate report citing `taste.md` with no one present. Categorically different from "my coding agent has good taste."
2. **Independent review your local agent can call.** A model reviewing its own code has correlated blind spots. The hosted Critic shares nothing with the author but git — different process, optionally different model. Mid-session, local Claude Code says "take this to the pass" via MCP and gets a review from a critic that wasn't in the room when the decisions were made. Locally you can *prompt* for independence; hosted, you *have* it.
3. **Work that outlives the laptop.** Durable sessions let fog-of-war span days (question Tuesday, answer Thursday, session resumes exactly there); intake advances from a phone-filed issue with no terminal open.
4. **The hygiene nobody gets to.** Backlog audits, `decisions.md` Revisit dates firing, doc-rot/dead-code sweeps — all specified in the reference library today, approximately never run locally because they compete with real work. Cron runs them on schedule; findings arrive as evidenced issues. Low glamour, high compound value.
5. **Overnight throughput — real, but last.** Ten well-specified items → ten sandboxes → ten gated PRs by morning. Entirely downstream of intake quality and the piece stacking the most new APIs; it is the payoff of 1–4, not the starting point.

**Where the cloud is not helpful:** exploratory work, design thinking, tight-loop debugging, anything steered mid-flight — that stays local, where omakase already lives. The cloud is for well-specified work, gating, and scheduled hygiene; the handoff continuum is load-bearing because of this split. One line: *local omakase makes your agent good; Omakase Cloud makes your repo immune to everyone else's bad agents — including yours on a tired day.*

## Architecture

### The whole team, hosted

All three teams run as durable Eve personas — **Engineer, Critic, Archivist** — each with their existing sub-personas, each independently addressable. They are **separate deployments**, and the Critic may run a *different model* than the Engineer: independence is architectural (different process, different model, no shared context except git), not just prompted.

### Three front doors (Eve channels)

1. **GitHub** — factory intake *and* front-of-house. Issue/PR @mentions start sessions; webhooks at `/eve/v1/github`. The daily menu and evening service post as a daily GitHub issue/discussion — approvals via checkboxes/comments, so the approval trail is searchable history and no chat platform is needed.
2. **HTTP + MCP** — personas as infrastructure. Each deployment exposes `/eve/v1/session`; a thin MCP wrapper lets local Claude Code (or any harness/CI) delegate to the hosted Critic as a subagent. Eve's HTTP channel also serves terminal UIs, so `npx omakaseagent chat` (existing CLI → deployed personas) is the developer-native "counter."
3. **Cron** — scheduled loops (below). `skill/reference/loops.md` becomes real automation. (Schedules are an Eve capability distinct from channels.)

**Deliberately not yet:** Slack/Discord/Teams/Telegram/Twilio (Eve supports them; front-of-house lives on GitHub for now), **Linear** (first-class agent delegation via Agent Sessions — the natural second intake for teams that live there), and an email digest via a custom `defineChannel` if GitHub-issue-as-menu proves noisy.

### The factory loop (dark-factory.md, executed)

Issue in → **fog-of-war questions asked on the issue thread** (durable session waits days without losing state) → scenario spec → **human approves intent** (Eve durable approval #1) → HarnessAgent spins up a sandbox → **bootstrap recursion**: `onBootstrap` runs `npx omakaseagent init`, so the sandbox runs the *same* `dist/claude` omakase-engineer as a laptop — no parallel implementation → mechanical checks by the verification critic → **gate report** posted as PR comment **plus required check run** → human checkpoint scaled by risk class (class 0 auto-green … class 3 always waits; maps to Eve `requireApproval` policies and branch protection) → merge. Multiple sandboxes run concurrently.

### The Pass (hosted Critic)

Kitchen term for the counter where the head chef inspects every plate. The Critic reviews PRs against `OMAKASE-CRITIQUE.md`, reads the target repo's `.omakaseagent/taste.md`, cites "Memory consulted," posts gate reports, and lands pass/fail as a required GitHub check. Also callable standalone over HTTP/MCP — critique-as-a-service for any pipeline.

### The taste-sync loop (the novel moat)

Because `.omakaseagent/` is committed, local and cloud share one taste memory **through git**: a local session learns "we reject X" → Archivist writes `taste.md` → committed → the cloud Critic enforces it on the next PR. Taste learned locally, enforced globally, zero hosted state. Competing review bots (CodeRabbit, Greptile) keep learning on their servers; omakase's stays yours.

### The always-on Archivist

Hosted, the Archivist becomes the long-running process it can't be locally: watches every merge and proposes `taste.md`/`decisions.md` updates **as PRs, gated at the Pass like any other change**; ships a weekly taste-synthesis report (patterns rejected, decisions hitting their "Revisit" dates, taste drift).

### Proactive quality (nightly service)

OMAKASE-RULES demands proactive quality; cron delivers it: nightly backlog audits, dead-code/doc-rot sweeps, dependency-slop checks. Findings open as issues **with evidence** — never silent fixes.

### Operating rhythm: the daily menu

Batch "humans approve intent": each morning front-of-house posts **the menu** — every intake that cleared fog-of-war, with scenario specs and risk classes. Approve/strike/adjust over coffee; the kitchen cooks all day; evening service delivers gate reports and what's waiting at the Pass. The human's job compresses to taste decisions at two checkpoints — dark-factory Level 4, operationalized.

### Local↔cloud continuum

Same standard both places; git is the only shared medium. `handoff.md` becomes literal: start locally in Claude Code, hand off to the factory to grind; or the factory does bulk work and you pull it down to taste.

### Taste scope: per-repo sovereign, org-extensible

Per-repo `.omakaseagent/` remains the sovereign unit. Org tier is a pure git-native extension: an optional `extends: <org taste repo>` pointer in the repo's taste file; the org repo is just more of the same markdown; repo taste always overrides org taste; local harnesses that ignore `extends` still work. One format decision now, zero new machinery.

## Boundaries (what this is NOT)

- **No hosted memory service.** Git carries all state.
- **No orchestration engine.** Eve owns durability, sessions, approvals. Writing workflow plumbing means we've left our lane.
- **No harness competition.** The Engineer delegates real coding to real harnesses via HarnessAgent; omakase never becomes its own agent loop.
- **No lights-out automation.** Level 4, not Level 5 — human checkpoints remain, scaled by risk class.

## Packaging & distribution

- `dist/eve/` as a sixth build target: markdown standard + thin template TS files (`agent/instructions.md` ← omakase-core, `agent/skills/` ← reference library, `agent/tools/` ← github-tools presets with `requireApproval` mapped from risk classes, `agent/channels/`).
- `npx omakaseagent init --eve` scaffolds the deployable project(s) — per-persona deployments.
- Existing verify pipeline covers `dist/eve` sync; template TS kept minimal ("9 lines" spirit) because **Eve API churn is near-certain** — it shipped very recently.

## Risks

- **Eve API churn** — keep the TS surface thin; markdown standard is churn-immune.
- **Vercel ships an opinionated review agent** — defense is the taste-sync loop and the standard, which they have no reason to replicate.
- **Per-PR inference cost** — borne by the self-deployer with their keys; economics deliberately not explored yet.
- **HarnessAgent + sandbox + Eve stack all v1-fresh** — the factory stacks three new APIs; the Critic path needs only one (Eve).

## Deliberately deferred (named, not decided)

- Slicing into buildable increments (user: "we'll get to slices later"). Natural seams observed: Critic/The Pass needs only Eve; the factory adds HarnessAgent + sandboxes; the personas are already separable bundles via the teams model.
- Naming & positioning (Omakase Cloud? The Pass as product name?), brand/site integration.
- Economics & ops for self-deployers (inference cost per PR, sandbox minutes, cron cost).
- Non-Vercel deployment recipe details (plain Node hosting, credential story without Vercel Connect).

## Verification (for the doc itself)

This brainstorm produced a vision document, not code. Verification = user review of this document. When slicing begins, each slice gets its own spec → plan → implementation cycle per the superpowers workflow, with end-to-end verification defined per slice (e.g., for The Pass: deploy the scaffolded critic against a test repo, open a PR containing known taste violations from `taste.md`, confirm gate report + failing check land).
