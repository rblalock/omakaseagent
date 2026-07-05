# Fog of war — built-in planning intake (not a slash command)

**No separate command.** This is how **@omakase-engineer** (and router `plan` when shaping work) burns off ambiguity **before** task briefs, scenarios, strategic plans, backlog specs, or loop setup.

The prompt, the plan, and the context window are the map. The codebase, the domain, and the user's actual intent are the territory. The gap is **fog** — and fog found before code costs minutes; the same fog found three PRs later costs the PRs.

**Read with:** `reference/task-intake.md`, `reference/plan.md`, `reference/backlog-audit.md`, `reference/loops.md`, `reference/factory-orchestration.md`.

**Lineage:** Patterns adapted from [dzhng/skills `explore-unknowns`](https://github.com/dzhng/skills) (MIT). Omakase-native: outputs feed briefs/scenarios/plans — never a standalone deliverable that blocks factory evidence.

---

## When to run (triggers)

| Signal | Action |
|--------|--------|
| Class 0–1, crystal-clear ask | **Skip** — infer brief inline (`task-intake.md`) |
| Class 2+, clear ask | Light pass only — name known unknowns in brief; no full walk |
| Ambiguous goal, "I'll know it when I see it", conflicting constraints | **Full quadrant walk** before brief confirm |
| Porting / matching a reference implementation | Full walk — stage 2 includes recon spike |
| Strategic `plan` or backlog audit scoping | Walk **known unknowns + unknown knowns** at minimum |
| Loop setup with empty backlog | Compressed walk during human interview (`loops.md`) |
| Mid-build plan stale | Re-run stages 2–4 on the slice that went red; update brief/plan before more code |

**Loop mode:** No synchronous walk mid-iteration. Fog uncovered during work → **halt**, record in ledger, resume after human clarifies or charter updates.

---

## Two moves (every stage)

1. **Reacting beats imagining.** Never ask the user to describe what they want when you can hand them something concrete to react to — a rendered option, a decisions table, a mock with fake data, a sharpened prompt to steal/skip. Reacting extracts tacit knowledge they cannot articulate unprompted.

2. **Assemble the reply.** End artifacts with the user's next message pre-drafted: steal/skip chips, resonate checkboxes, a decisions table, a copyable sharpened prompt — near-zero typing to continue.

---

## The quadrant walk (five stages, in order)

Name the current quadrant as you go. Finish the stage in front of you before opening the next. The walk ends with a **four-quadrant map** in the thread (or handoff) — no map, not done.

### Stage 1 — Known knowns

- Scan the territory: read real files, `factory.md`, `taste.md`, `decisions.md`, relevant tests/CI — do not ask what the repo can answer.
- Open with settled ground: what is already decided, what contracts are sacred, what the user already stated.
- **Done when** settled facts are listed with file citations where they matter.

### Stage 2 — Known unknowns

- Name the questions you can already ask; resolve **one at a time** with a recommended answer the user can accept/reject/edit.
- Inspect the repo before asking humans what code already proves.
- External references, unfamiliar libraries, or "how do people usually do this?" → targeted research; capture links in the map.
- **Done when** each named question is closed (answered) or explicitly deferred with owner and slice.

### Stage 3 — Unknown knowns

- Extract taste and tacit context nobody put into words — vocabulary, conventions, who consumes this, what "done" means to whoever inherits it.
- Techniques: design directions (same data, incompatible layouts), mock-before-wire, teach-the-vocabulary ladder, concrete sample artifacts with per-line steal/skip.
- **Done when** the user reacted to something concrete and extracted answers are on the map.

### Stage 4 — Unknown unknowns

- Sweep for landmines: integration surprises, migration traps, visual variables bundled into one slice, auth/money boundaries, stale assumptions in `decisions.md`.
- Fan out read-only recon subagents when the harness supports it — findings only, no fixes.
- **Done when** material risks are on the map or explicitly accepted.

### Stage 5 — Hand over the map

Deliver a compact **four-quadrant map**:

| Quadrant | Contents |
|----------|----------|
| Known knowns | Settled facts + citations |
| Known unknowns | Closed questions + deferred items |
| Unknown knowns | Extracted taste/tacit context |
| Unknown unknowns | Risks, landmines, spikes needed |

Then **route the map** (do not implement yet):

- → **Task brief** + scenarios (`task-intake.md`, `factory-orchestration.md` Phase 1)
- → **Strategic plan** (`reference/plan.md`)
- → **Execution plan(s)** (`reference/execution-plan.md`, `backlog-audit.md`)
- → **Loop charter + queue** (`loops.md` setup)

---

## Rules

- **Order governs presentation, never disclosure.** A finding that bears on a decision in flight is shown the moment you have it — then filed on the map. Never hold information for a later stage's turn.
- **Nothing closes off-screen.** Any question recorded as closed must have been shown to the user first.
- **Cite the territory.** Claims about the codebase cite real files read; invented specifics are labeled as such.
- **Stop at stage boundaries that need reaction.** Do not barrel into implementation on unconfirmed guesses — implementing is a separate factory phase.
- **Class 3+ and scenario gaps** still require human confirm before deep work — the walk informs the ask; it does not replace Omakase risk policy.

---

## Compression modes

| Mode | Stages | When |
|------|--------|------|
| **Full** | 1 → 5 | Ambiguous Class 2+, reference ports, taste-heavy UI |
| **Light** | 1 + 2 only | Clear Class 2+ — unknowns listed in brief |
| **Setup** | 2 + 3 + 5 | Loop charter interview — priority, out-of-scope, taste for the queue |

### Setup mode (loop charter — interview before materialize)

When `.omakaseagent/backlog/` has no TODO plans and the user wants to drain the loop:

1. **Recon read-only** — inform proposals only; recon does **not** set the queue.
2. **Present setup interview** — known unknowns (what to work on, priority, out-of-scope, risk ceiling) and unknown knowns (taste from `taste.md` / `decisions.md`). End with a **PROPOSED queue** table (titles + priority — not full execution plans yet).
3. **Stop and wait** — do not run `omakase learn`, write `backlog/NNN-*.md`, or start iterations until the human confirms or edits the proposal.
4. **After confirm** — run `omakase learn` if factory layout is missing; write execution plans; request charter approval.

---

## After the walk

The map lives on: link it from handoffs (`.omakaseagent/handoffs/<date>-<slug>-brief.md` or plan). When implementation diverges from the map, update the map **before** widening the patch — same discipline as execution-plan drift checks and STOP conditions.