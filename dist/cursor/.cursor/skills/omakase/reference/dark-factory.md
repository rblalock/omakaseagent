# Dark factory — Level 4 with Omakase

**Read this first if you are an agent.** Per-repo commands and checks live in `.omakaseagent/factory.md` (created by `omakase learn`). Day-to-day intake: `reference/task-intake.md`. Ambiguous goals: `reference/fog-of-war.md` (built into Engineer/plan/loop — not a slash command).

---

## What this pattern is (and is not)

**Omakase "factory"** is a **trust and evidence system** for agent engineering — not a deployment pipeline and not lights-out automation.

| It **is** | It **is not** |
|-----------|----------------|
| A way to earn **longer agent runs** without the human reading every line | Level 5 dark factory (unattended merge, ship, deploy) |
| **Scenarios** humans approve once; agents prove behavior later | A DOT/Attractor runner or custom orchestration engine (v1) |
| **Mechanical checks** agents run (`build`, `test`, CI scripts) | Replacing the repo's CI — it complements CI |
| **Gate reports** that bundle evidence for human checkpoint | Vague "done" in chat |
| **Risk classes** — more autonomy on low risk, more human on high | Same rules for docs and auth migrations |

**Goal:** Humans spend review time on **intent and proof**, not routine diff reading. Agents spend effort on **implementation + running checks + writing evidence**. Omakase supplies **taste, critique, memory, and gate shape**.

Industry "dark factory" often means full autonomy. **Omakase targets Level 4 (Dan Shapiro):** human approves what should be true; agent proves it; human accepts at checkpoint.

---

## What "automation" means here

**Automated today (agent responsibility):**

- Co-create task brief + scenarios from plain user goals (`task-intake.md`)
- Run repo mechanical commands listed in `factory.md`
- Produce gate report under `.omakaseagent/gates/`
- Cite memory; propose memory updates when durable
- Offer `omakase learn` when factory layout is missing

**Automated in CI (repo scripts):**

- Gate report headings — `npm run verify:gate-reports`
- Class 2 PR gate discipline — `npm run verify:pr-gate-diff`
- Scenario eval contracts — `npm run verify:scenario-evals` (`evals/*.eval.json`)
- Skill/dist drift — `npm run verify:drift`

**Automated later (live harness evals, Phase 5+):**

- With-skill vs baseline runs on seed prompts
- Narrow task classes may earn more autonomy **after** evidence history — still human accept

**Never automate in v1:**

- Merging, deploying, production changes without explicit human accept
- Judging "taste" or "slop" purely with scripts — use **@omakase-critic**
- Inventing scenarios that change product intent without user confirm (Class 2+)

**Operating rule (encode, don't re-review):** If a human would check the same thing on every task, propose a **scenario** or **mechanical check** and add it to `factory.md` / CI — do not make the human repeat the inspection.

---

## Rule

> Humans approve what should be true. Agents prove it became true.

| Human owns | Agent owns | Omakase owns |
|------------|------------|--------------|
| Intent, constraints, scenario approval, risk class, final accept | Implementation, running checks, evidence collection, gate draft | Taste bar, critique, memory shape, gate language |

---

## Loop (one task)

1. **Task brief** — agent co-writes from user goal (no "seed" jargon for users)  
2. **Scenarios** — agent proposes; human confirms before Class 2+ deep work  
3. **Work** — `@omakase-engineer` between gates; memory first  
4. **Evidence** — scenarios + mechanical + critic + memory  
5. **Checkpoint** — gate file; human reviews evidence stack  

**Stacking loops** (running this unattended under a standing charter, L0–L4 ladder, runner contract): `reference/loops.md`.

---

## Risk classes

| Class | Autonomy | Examples |
|-------|----------|----------|
| 0 | High — brief inline, light checkpoint | Docs, README |
| 1 | Medium — run mechanical checks | CI, scripts |
| 2 | Confirm brief + scenarios first | Features, personas, CLI |
| 3+ | Stay interactive | Auth, money, migrations |

Repo-specific examples: `.omakaseagent/factory.md`.

---

## Quality gates (Omakase rubric applied to the work)

1. Context loaded (memory cited)  
2. Task/scenario clarity  
3. Anti-slop critique  
4. Verification (fresh command output, not "should work")  
5. Memory update when durable  
6. Checkpoint artifact exists (Class 2+)  

---

## Commands

```bash
npx omakaseagent init    # memory + agents
npx omakaseagent learn   # per-repo factory.md + starter scenarios
npx omakaseagent learn --dry-run
npx omakaseagent status  # loop state: approval, Stop conditions, next eligible item
npx omakaseagent status --gates  # pending gate paths for batch review
```

**Team loop (Class 2+):** `reference/factory-orchestration.md`. Worked example: `examples/factory-e2e/`.

**Backlog audit (Engineer, no extra command):** `reference/backlog-audit.md` — findings and execution plans in `.omakaseagent/backlog/`; factory loop unchanged for implementation.

**Standing loops (charters in `.omakaseagent/loops/`):** `reference/loops.md` — drain the backlog without per-task prompting; gates reviewed in batch.
