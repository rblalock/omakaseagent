# Backlog audit — codebase improvement the Omakase way

**No separate slash command.** This workflow is triggered by plain goals to **@omakase-engineer** (or the router when native agents are absent):

- "Audit the codebase and tell me what's worth fixing"
- "Find tech debt / security / perf issues"
- "What should we improve next?"
- "Review what this branch changes before I open a PR"
- "Reconcile the backlog" / "refresh stale plans"
- "Write an execution plan for fixing X" (skip audit — recon + single plan)

**Read with:** `reference/dark-factory.md`, `.omakaseagent/factory.md`, `taste.md`, `decisions.md`, `reference/execution-plan.md`, `reference/fog-of-war.md`.

---

## What this is (and is not)

| It **is** | It **is not** |
|-----------|----------------|
| Engineer-led **advisor** pass: understand, judge, specify | A second router command or external skill install |
| Findings + **execution plans** in `.omakaseagent/backlog/` | Strategic `/omakase-router plan` output (see `reference/plan.md`) |
| Factory execution afterward: critic + gate + memory | "Plan passed checklist" without Omakase evidence |
| Read-only on **source** during the audit phase | Engineer implementing fixes during the same audit turn |

**Economics (borrowed principle):** use the capable model for understanding and specifying; delegate implementation to `omakase-implementation-lead` or a follow-up Engineer session with a self-contained execution plan. The **execution plan** is the handoff product — its quality determines whether the executor succeeds.

---

## Hard rules (audit phase)

1. **Do not modify source code during audit.** The only writes in the audit turn go under `.omakaseagent/backlog/` (and optional `.omakaseagent/handoffs/` for the findings summary). Implementation happens in a **separate** work phase via factory orchestration.
2. **Do not run commands that mutate the working tree** during audit — no installs, commits, formatters. Read, search, read-only analysis (`tsc --noEmit`, lint check mode, cheap test runs if side-effect free).
3. **Every execution plan must be self-contained** — see `reference/execution-plan.md`. The executor has not seen the audit session.
4. **Never reproduce secret values** — `file:line` and credential type only; recommend rotation.
5. **If the user asks you to implement during audit,** finish or skip to spec: write/update the execution plan, then run factory orchestration in a new phase — do not "quick fix while you're in there."
6. **Cite memory** — findings and plans must respect `taste.md` and `decisions.md`; do not re-litigate recorded rejections without new evidence.

---

## Workflow

### Phase 0 — Fog (when scope is open-ended)

When the user asks "what should we improve?" without a narrow target — run **`reference/fog-of-war.md`** light mode after recon: name known unknowns (priority, risk appetite, out-of-scope) and unknown knowns (taste from `taste.md`, rejected directions from `decisions.md`) before the findings table. Skip when the user names a specific fix ("write a plan for X").

### Phase 1 — Recon (always)

- Read `README`, `AGENTS.md`, root configs, CI, directory layout.
- Pull mechanical commands from `.omakaseagent/factory.md` when present (not guessed).
- Note conventions with an exemplar file path for plans to reference.
- `git log --oneline -30` and churn hotspots when useful.

If there is no verification baseline (broken build, no tests), say so — "establish baseline" is often finding #1 and blocks risky plans in dependency order.

### Phase 2 — Audit (parallel when repo is non-trivial)

Audit across these categories (scope by effort level below):

| Category | Look for |
|----------|----------|
| Correctness / bugs | Logic errors, race conditions, error swallowing |
| Security | Injection, authz gaps, secrets in repo, unsafe defaults |
| Performance | N+1, hot loops, unnecessary allocation |
| Test coverage | Untested critical paths, missing regression tests |
| Tech debt & architecture | Duplication, drift, boundary violations vs taste |
| Dependencies & migrations | Stale deps, breaking upgrades, dead code |
| DX & tooling | Broken scripts, slow CI, confusing local setup |
| Docs | Wrong README, missing runbooks for real workflows |
| Direction | Grounded next features — **evidence from repo only**, not generic slop |

**Effort level** (user sets in plain language; default **standard**):

| | quick | standard | deep |
|---|-------|----------|------|
| Coverage | Hotspots only | Hotspot-weighted | Whole repo |
| Subagents | 0–1 | ≤4 concurrent | ≤8, per category |
| Findings | Top ~6, HIGH confidence | Full vetted table | Full + LOW "investigate" |

Fan out read-only subagents per category when the harness supports it. Each subagent prompt must include: repo path, category scope, recon facts, instruction to return **findings only** (no fixes), and the finding format below.

Say in the report what was **not** audited.

**Branch scope** (when user asks about current branch / pre-PR): limit to files changed since merge-base with default branch plus direct importers. Tag each finding **`introduced`** or **`pre-existing`**. Separate them in the table — do not blame the branch for legacy debt in touched files.

### Phase 3 — Vet (mandatory before presenting)

Subagents over-report. For every finding in the table, **open the cited code yourself**. Expect:

- **By-design** behavior reported as bug (e.g. standard `https_proxy` flagged as SSRF)
- **Mis-attributed** evidence (real issue, wrong file/line)
- **Duplicates** across categories

Downgrade, correct, or reject. Record rejections in `.omakaseagent/backlog/README.md` under **Findings considered and rejected** — durable policy rejections also belong in `decisions.md` (offer **@omakase-archivist** when the user wants them persisted).

### Phase 4 — Present and select

Findings table ordered by leverage (impact ÷ effort × confidence):

| # | Finding | Category | Impact | Effort | Risk class | Confidence | Evidence |

Present **direction** suggestions separately (2–4 max) — options to weigh, not ranked against bugs.

Ask which findings become execution plans (suggest top 3–5 + user picks). Note **dependency order** (e.g. characterization tests before refactor).

Wait for selection. Do not write plans nobody asked for.

**Loop trigger:** "run the loop" / "drain the backlog" with an **empty backlog** (no TODO rows) → **interview the human** for what the loop should work on (scope, priority, out of scope); draft charter + queue + plans from their answers; one confirm; charter approval — then iterations (`reference/loops.md` setup table). Full repo audit is optional recon, not a substitute for the interview.

**Skip audit** when the user already named the work: recon only enough to spec → one execution plan via `reference/execution-plan.md`.

### Phase 5 — Write execution plans

For each selected finding, write `.omakaseagent/backlog/NNN-<slug>.md` using `reference/execution-plan.md`.

- Stamp `git rev-parse --short HEAD` on each plan.
- Excerpts from **your own reads**, never from subagent reports alone.
- Monotonic numbering; reconcile with existing `backlog/README.md` — no duplicate findings.
- Update `backlog/README.md`: execution order, dependencies, status column, rejected findings.

### Phase 6 — Execute (separate phase — factory orchestration)

When the user says implement / execute / ship a backlog item:

1. Treat the execution plan as the **task brief charter** (`reference/task-intake.md`).
2. Class **2+:** scenarios + one confirm before deep work.
3. Delegate to `omakase-implementation-lead` when isolated context helps; charter = full plan file path.
4. Run `factory.md` mechanical checks.
5. **@omakase-critic** — rubric **and** plan done criteria.
6. Gate file links the backlog plan path and records checklist results in `## Mechanical evidence`.
7. Human checkpoint — merging stays human-owned.

Never close Class 2+ with only plan checkboxes and no gate.

### Phase 7 — Reconcile

When the user asks to refresh the backlog or at the start of a new audit if `backlog/` exists:

- **DONE** — verify gate exists or code clearly landed; mark DONE in index.
- **BLOCKED** — investigate; rewrite plan or retire with reason.
- **Drifted** — plan SHA vs HEAD on in-scope paths; refresh excerpts or mark STALE.
- **Fixed independently** — retire finding; note in rejected/retired section.
- Cross-check: backlog status should not say DONE without evidence (gate or explicit Class 0–1 light checkpoint).

---

## Finding format (for audit subagents and the table)

Each finding needs:

- **Evidence** — `path:line` (multiple if needed)
- **Impact** — what breaks, slows, or risks if ignored
- **Effort** — S / M / L
- **Risk class** — 0–3+ per `factory.md` / `dark-factory.md` (fixes to auth = 3+)
- **Confidence** — HIGH / MED / LOW
- **Why not now** (optional) — honest deprioritization

No vibes-only findings.

---

## Relationship to other Omakase artifacts

| Artifact | Role |
|----------|------|
| `reference/plan.md` | Strategic plan — why, options, phasing (router `plan` or Engineer when shaping direction) |
| `reference/execution-plan.md` | Tactical plan — how, steps, STOP, verify gates (backlog/) |
| `reference/handoff.md` | Session continuity; audit summary can land in `handoffs/` |
| `reference/factory-orchestration.md` | Mandatory loop after plan selection |

---

## Tone

Advising, not selling. Prefer "not worth doing" over padding the list. A short list of high-confidence plans beats thirty vague ones. Findings must pass the taste bar — no AI slop recommendations, no generic "add monitoring" without repo evidence.
