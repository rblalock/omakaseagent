# Loops — stacking the factory

**Read with:** `reference/dark-factory.md` (Level 4 bar), `reference/factory-orchestration.md` (the loop body), `reference/execution-plan.md` (STOP + done criteria). Repo specifics: `.omakaseagent/factory.md`.

A **loop** is the factory run repeatedly without a human prompting each iteration. The human approves a **standing charter** once, then reviews gate evidence in batch. Level 4 holds: the human leaves the **iteration**, not the system.

## Two ways to run the same loop

| Mode | Motor | When |
|------|-------|------|
| **Attended** (default) | The agent itself — user says "run the loop" / "drain the backlog" and the agent **chains iterations in-session** until a Stop condition or the cap | Any harness, user present but not prompting per task |
| **Unattended** | An external runner (bash `while`, CI cron, cloud agent schedule) restarts a **fresh run per iteration** with the fixed prompt below | Overnight / scheduled drains; fresh context per iteration resists context rot |

Same charter, same ledger, same gates either way. **Omakase is the loop discipline, not the loop motor** — all loop state lives on disk in `.omakaseagent/`, so any harness or human can pick up where any other left off.

---

## What this is (and is not)

| It **is** | It **is not** |
|-----------|----------------|
| A named ladder so "go up/down a loop" is actionable | A new autonomy level — checkpoint discipline holds |
| **Loop charters** humans approve once (`.omakaseagent/loops/`) | Permission to merge, ship, or deploy unattended |
| A **runner contract** any harness can drive (bash, CI cron, cloud agent) | An orchestration engine, scheduler, or DOT runner (v1) |
| One gate per iteration — evidence compounds | "Ran great overnight" with no artifacts |

---

## Loop ladder

| Level | Name | One iteration is | Human role |
|-------|------|------------------|------------|
| **L0** | Prompt loop | One human message → one agent reply | In every iteration |
| **L1** | Task loop | Factory loop on one task: brief → scenarios → work → evidence → gate | Approves brief; accepts gate |
| **L2** | Drain loop | One L1 run on the next eligible queue item (usually `.omakaseagent/backlog/`) | Approves charter once; reviews gates in batch |
| **L3** | Improvement loop | Audit → plans → drain (L2) → reconcile (`reference/backlog-audit.md`) | Approves charter; selects findings; reviews per cycle |
| **L4** | Fleet loop | L3 per repo across many repos | Named horizon only — not specified in v1 |

```mermaid
flowchart LR
  L0[L0 prompt] --> L1[L1 task]
  L1 --> L2[L2 drain]
  L2 --> L3[L3 improvement]
  L3 --> L4[L4 fleet]
  L2 -.->|downshift on failure| L1
  L1 -.->|upshift via decisions.md| L2
```

L1 is `reference/factory-orchestration.md` unchanged. L2 and L3 are L1 stacked under a charter — no new machinery, just standing intent plus a queue.

---

## Gearbox — when to shift

**Downshift (reliability).** Mandatory, immediate:

| Trigger | Shift |
|---------|-------|
| Gate rejected at batch review (flip the gate's `**Review:**` line to `rejected — <reason>`; `npx omakaseagent status` halts the loop on it) | That task class drops to L1 until its next accepted gate |
| Same STOP condition fires twice | Drop to L1; fix the plan or scenario before resuming |
| Drift check fails | Halt the loop; plans are stale — re-audit |
| Item exceeds charter risk ceiling or touches Class 3+ | Skip and flag; that item is handled interactively (L0/L1) |
| Two consecutive failed iterations | Halt the loop and report |

**Upshift (leverage).** Proposal-only: after **5 consecutive accepted gates** in a task class with zero critic P0/P1 findings, the agent may propose promoting that class one level up — as a `decisions.md` entry the human approves. Autonomy is earned and recorded, never assumed. The streak is mechanical, not remembered: `npx omakaseagent status` counts accepted `**Review:**` lines and reports when the threshold is met. Status counts the streak only — before proposing, the **agent** confirms the other two conditions (same task class, zero critic P0/P1 in those gates).

**Two reviews per plate (do not conflate them):**

| Review | Who | When | What it does |
|--------|-----|------|--------------|
| **Critic gate** | `@omakase-critic` (team) | **Every iteration**, Class 2+, before the gate file is written | Quality control — rubric pass, P0/P1 hunt; fills the gate's `## Critic` section |
| **Review line** | Human only | Batch, on your time, sampling allowed | Trust ledger — accept/reject; rejection halts, accepts compound into upshift streaks |

The loop does not thin the team: each iteration is a **full factory pass** per `reference/factory-orchestration.md` — Engineer orchestrates, Critic gates Class 2+ work before the plate reaches the belt. If the critic finds P0/P1 mid-iteration, **fix it within the iteration and re-pass the critic, or record the iteration FAILED** — never write a gate with unresolved P0s and keep looping.

**Gate review protocol (the trust verbs, on disk):** every loop gate carries a `**Review:** PENDING` line the agent writes at gate creation and **never flips itself**. At batch review the human replaces it — `accepted by <name> <date>` or `rejected — <reason>`. A gate with no Review line counts as pending. **Pending does not block the belt** — humans sample; the critic already did quality control. Rejection halts; accepts build the streak. This is what makes "a clean track record unlocks longer runs, a rejected result reins them in" mechanically true rather than conversational.

**Loop law (the Salty Lesson as house rule):** every manual human intervention mid-loop must leave behind a scenario, mechanical check, or memory entry that makes the next intervention unnecessary. An intervention that leaves nothing behind is a bug in the loop, not just in the code.

---

## Loop charter — standing intent

**Storage:** `.omakaseagent/loops/<slug>.md` — one file per standing loop. The charter is to a loop what a scenario is to a task: approved once, then binding. `omakase learn` scaffolds `loops/backlog-drain.md` as the default.

```markdown
# Loop: <slug>

## Intent
What this loop drains or improves, in one paragraph.

**Approval:** Approved by <name> on <date>. (Generated charters say UNAPPROVED —
agents halt until a human replaces the line.)

## Scope
- **Queue:** `.omakaseagent/backlog/` in dependency order (or another mechanical source)
- **In-scope paths:** ...
- **Risk class ceiling:** 2 — items above it are skipped and flagged, never attempted

## Iteration
One eligible item per run via `reference/factory-orchestration.md`: brief from the
plan, mechanical checks, critic, gate, queue status update, ledger row.

## Stop
- Queue empty
- A STOP condition in an execution plan fires
- A gate is rejected at review
- Two consecutive failed iterations
- Iteration cap: 5

## Checkpoint policy
- Gates reviewed in batch — no synchronous confirm per iteration
- Batch review = flip each gate's **Review:** line to accepted/rejected;
  `npx omakaseagent status` reads it (rejected halts the loop; agents never flip it)
- Halt for human immediately when: risk ceiling would be exceeded, drift check
  fails, or work needs a scenario the charter does not cover

## Ledger
| # | Date | Item | Gate | Result |
|---|------|------|------|--------|
```

Ledger **Result** is one of: `DONE`, `FAILED`, `SKIPPED (reason)`, `HALT (stop condition)`, `EMPTY` (no eligible items remain). The ledger is append-only and is the mechanical surface runners check between iterations.

An iteration that finds no eligible item flags anything it passed over (`SKIPPED` row per item, mark it in the queue index) and then appends an `EMPTY` row — `EMPTY` must be the **last** row so runners halt on it.

---

## Before the first iteration (setup — not part of the belt)

| Step | Who | Action |
|------|-----|--------|
| 1 | Human | Approve the charter — replace `**Approval:** UNAPPROVED` with `Approved by <name> on <date>`. **Agents must show UNAPPROVED and wait; never edit this line.** |
| 2 | Agent + human | If backlog has no TODO plans: **interview the human** — what the loop should work on, out of scope, priority/order. Draft charter + queue + `backlog/NNN-*.md` from their answers (repo recon only to inform proposals, not to drive the queue). **Do not start the drain loop until plans exist.** |
| 3 | Human | Confirm the proposed queue once. Approve the charter. Then say "run the loop." |

Empty backlog + "run the loop" = **setup phase only** — interview, propose backlog, one confirm, charter approval — then the belt runs.

## Agent NEVER (loop mode)

- **NEVER** replace `UNAPPROVED` on the charter Approval line — only a human may approve a standing order.
- **NEVER** skip the setup interview + human confirm when the backlog has no TODO items (unless the user already pointed at specific `backlog/NNN-*.md` files).
- **NEVER** prepend ledger rows — append at the **bottom** of the ledger table; `EMPTY` must be the **last** row.
- **NEVER** flip a gate's `**Review:**` line — write `PENDING` only; humans accept/reject at batch review.

## One iteration — agent contract

The iteration is the **atomic unit**: one queue item, one gate, one ledger row.

1. **Run `npx omakaseagent status` first when the CLI is available.** It deterministically evaluates the approval line, the charter's **mechanical** Stop conditions (ledger HALT/EMPTY, iteration cap, double-FAILED, rejected gate reviews, stuck IN PROGRESS items), and the next eligible item — trust its output over your own parsing of the charter and queue (`HALT` → append the ledger row and stop; `NEXT` → that is your item). Plan-level STOP rules and the drift check remain **your** job during the iteration. Without the CLI, derive all of it by hand: read the charter, `factory.md`, `taste.md`, `decisions.md`; Approval line says UNAPPROVED → halt; check Stop conditions **before** picking work.
2. Pick exactly **one** eligible queue item (status TODO, dependencies DONE, within risk ceiling) — `npx omakaseagent status` already names it.
3. Run the **full** factory loop (`reference/factory-orchestration.md`) — including `@omakase-critic` on Class 2+ before the gate is written. Critic P0/P1 → fix and re-pass within the iteration, or record FAILED; never carry unresolved P0s into a gate. Scenarios must already exist or be covered by the charter — needing a new scenario mid-loop is a halt-for-human, not a question.
4. Close the iteration — all four writes: gate file (including its `**Review:** PENDING` line — flipping it is human-only), queue status row, plan's **Gate** field, ledger row.
5. **Attended:** return to step 1 and chain the next iteration. **Unattended:** exit — the runner starts the next fresh run.
6. **On halt:** run `npx omakaseagent status --gates` and hand the human a ledger summary plus pending gate paths.

One item per iteration — no "while I'm here." Where the interactive factory would ask the user, a loop **stops and records why**. No synchronous confirm mid-iteration, no scope improvisation, no merge/deploy.

---

## Runner contract — bring your own loop (unattended mode)

Omakase provides the loop body and the brakes; the runner is yours. Any runner qualifies if it:

1. Starts each iteration as a **fresh agent run** with the fixed prompt below — no accumulated chat context.
2. Checks halt state **mechanically** between iterations — `npx omakaseagent status --quiet` (exit 0 = work available, 2 = halted/empty); without the CLI, grep the last ledger row for `HALT`/`EMPTY`.
3. Enforces the iteration cap even if the agent does not.
4. Never merges, deploys, or auto-accepts gates — batch review stays human.

**Fixed iteration prompt:**

```text
Read .omakaseagent/loops/backlog-drain.md and .omakaseagent/factory.md.
Execute exactly one iteration per reference/loops.md. Honor Stop conditions.
Write the gate file, append the ledger row, then stop.
```

**Example runners** (same contract, any harness):

```bash
# bash + any headless agent CLI (opencode shown; claude/cursor-agent equivalent)
PROMPT='Read .omakaseagent/loops/backlog-drain.md and .omakaseagent/factory.md. Execute exactly one iteration per reference/loops.md. Honor Stop conditions. Write the gate file, append the ledger row, then stop.'
while npx omakaseagent status --quiet; do
  opencode run --agent omakase-engineer "$PROMPT" || break
done
# no CLI? swap the condition for: tail -1 .omakaseagent/loops/backlog-drain.md | grep -qvE 'HALT|EMPTY'
```

- **CI cron:** schedule the same single-iteration prompt; one iteration per workflow run; the branch/PR carries the gate for batch review.
- **Cloud agents:** paste the fixed prompt; one iteration per agent run; review gates when you return.

---

## Relationship to other artifacts

| Artifact | Approves | Lifetime |
|----------|----------|----------|
| Scenario (`scenarios/`) | Product behavior | Until behavior changes |
| Execution plan (`backlog/`) | One task's steps + STOP rules | One task |
| **Loop charter (`loops/`)** | **Standing intent for repeated runs** | **Until revoked or Stop** |
| Gate (`gates/`) | Nothing — it proves | One iteration |
| `decisions.md` | Durable policy, including upshifts | Until revisited |

Inspired by [Loopcraft: The Art of Stacking Loops](https://www.latent.space/p/ainews-loopcraft-the-art-of-stacking).
