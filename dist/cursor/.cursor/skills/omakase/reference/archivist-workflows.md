# Archivist workflows — git recap & chat preferences

Protocols for **@omakase-archivist**. Not user-facing skills. Distilled from cursor-team-kit `weekly-review`, `what-did-i-get-done`, and `workflow-from-chats` (Omakase voice).

**Router:** Use the native Archivist for these. Router `taste` is for reading/updating memory on demand — not weekly recaps.

This doc covers chat/git evidence and drift audit only.

---

## Setup (all workflows)

Read `.omakaseagent/taste.md` and `decisions.md` when present. Include **Memory consulted** in the output (exact entries or “none yet — init seed only”).

## When to run

| User intent | Workflow |
|-------------|----------|
| Weekly recap, retro, “what did I ship” | Git recap (below) |
| Specific date range (“since Monday”, “last 3 days”) | Same git recap — set `window` |
| “Mine chats”, “learn my preferences”, encode workflow | Chat preferences (below) |
| Cross-memory + git + chats → patterns, gaps, evolution | Delegate **Memory Synthesizer** with charter citing this doc |

---

## 1. Git recap (one workflow, `window` parameter)

**Goal:** A short executive summary a human would actually send — **not** a `git log` dump. If the output is only commit subjects pasted in a list, the workflow failed.

### Setup

1. Resolve **author** — default `git config user.email`. If the user asks for team/we scope, use all authors or named emails they give. **Sanity check:** if that email has zero commits in the window, run `git shortlog -sn main --since="<since>"` and ask the user which author(s) to use, or match a name they gave (e.g. `--author="Rick"`). Cloud/agent environments often use a bot email that is not the human author.
2. Resolve **window** — default last **7 days**; weekly-style asks may use up to **10**. User ranges (“yesterday”, “since 2026-05-28”) → concrete dates; state the range used in the output.
3. **Branch context** — default `main` (or repo default: `git symbolic-ref refs/remotes/origin/HEAD` shortened to branch name). Use current branch only if the user scoped to it.
4. Collect commits on that branch in the window for the author(s). **Exclude merge commits.**

### Commands (starting point — adapt if repo differs)

```bash
git config user.email
git log main --no-merges --author="<email>" --since="<since>" --until="<until>" --format="%h %ad %s" --date=short
```

For substantial-looking subjects, skim the change (not every commit):

```bash
git show <hash> --stat
git show <hash> -p -- <limit large diffs mentally; skip formatting-only>
```

### Synthesis rules

- Group into **2–5 themes** (what moved the project), not one bullet per commit.
- **Omit** cosmetic-only work (formatting, import churn, rename-only) unless it was the whole week.
- Describe changes **functionally** — do not infer motivation (“because you wanted…”).
- **Classification paragraph** (required, short): split the week into likely **bugfix**, **tech debt**, and **net-new** using subjects + diff skim. No separate Omakase taxonomy — three buckets are enough.

### Memory writes (git only)

- **Default: report only** — recap is the deliverable.
- **Optional:** If a commit message or diff clearly records a **decision** (architecture, policy, tool choice), propose a **`decisions.md` row** (Context / Decision / Why / Revisit if) in a fenced diff block — **do not apply** until the user confirms.
- Do **not** bulk-append recap bullets to `taste.md`.

### Output shape

```markdown
## Shipped recap (<start> – <end>, `main`, <author>)

- <theme 1>
- <theme 2>
…

**Classification:** <2–4 sentences: bugfix vs tech debt vs net-new>

**Proposed decisions.md** (if any; omit section if none):
<diff or table rows for user confirm>
```

---

## 2. Chat preferences (7-day default)

**Goal:** Durable workflow rules for **future** agents — not chat summaries.

### Capability

1. If Cursor-style parent transcripts are readable under the project (agent may search `agent-transcripts` under the Cursor project dir) → run full protocol.
2. If not → ask for pasted excerpts or topics; state what could not be verified. **Do not** print local filesystem paths in user-facing output.

### Protocol

1. **Window** — default **7 days** unless the user specifies otherwise.
2. **Inventory** (internal): topic, parent conversation id, approximate date, why it may contain preferences. Subagent transcripts are evidence only; **cite parent conversations** in output (title + id).
3. **Scan** for explicit signals: “I prefer”, “always”, “never”, “not what I asked”, “stop”, review/PR/CI/skill corrections.
4. **Preference atoms:** trigger, rule, quality bar, stop condition, evidence, confidence (**strong / medium / weak / contradicted**).
5. **Contradicted** — two parents support incompatible rules (e.g. “always squash” vs “never squash”). **Do not write files.** List under **Contradicted** and ask the user which wins.
6. **Cluster** by shape: shipping, review, simplification, debugging, communication, delegation, validation.
7. **Artifact choice:**
   - **Default:** patch `taste.md` (observable preferences) or `decisions.md` (one-off choices with Why).
   - **Ask first** if the user would need a **new skill, rule, or workflow doc** outside `.omakaseagent/`.
8. **Strong** preferences only for proposed patches; medium/weak → **Consider**; contradicted → ask (above).

### Writes

- Show **exact diffs** for `taste.md` / `decisions.md`. **Wait for user confirm** before applying.
- Never overwrite the user’s voice; add or sharpen.
- No raw chat dumps, secrets, customer data, or credentials in output.

### Output shape

```markdown
## Chat preference synthesis (<window>)

**Target workflow:** <one sentence>

**Evidence:** <parent title> (<conversation id>) — <one line why it counts>

**Adopt** (strong → proposed patches below)
**Consider** (medium/weak)
**Dismissed** (stale, one-off, low signal)
**Contradicted** (needs your call — do not patch until resolved)

### Proposed patches (confirm to apply)

(diff blocks for taste.md / decisions.md — user confirms before apply)
```

---

## 3. Delegation to Memory Synthesizer

Delegate when the charter needs **compiled truth** across `taste.md`, `decisions.md`, git themes, and chat atoms — evolution narrative, gap analysis, or co-curator structure proposals.

The lead may still run git or chat workflows alone when the ask is a recap or a preference pass only.

---

## 4. Drift audit (skill source vs dist vs TEAMS.md)

**Goal:** Catch persona/router drift before it reaches users — especially after `skill/` edits without `npm run build`.

### When to run

| Trigger | Action |
|---------|--------|
| After merging `skill/` or native generator changes | `npm run verify:drift` (CI runs this on main/PR) |
| Weekly maintenance or “does dist match skill?” | Same + `npm run build` if drift found |
| Before adding a new specialist | Check overlap per `reference/team-architecture.md` |

### Mechanical check

```bash
npm run verify:drift
```

Validates: `TEAMS.md` lists core leads; `dist/*/agents/omakase-{engineer,critic,archivist}.md` include `teams/` bundles; persona tree under `skill/teams/` is non-empty.

### Report shape (default: report only)

```markdown
## Drift audit (<date>)

- **TEAMS.md:** pass | issues
- **dist bundles:** pass | rebuild needed
- **scenario evals:** `npm run verify:scenario-evals` pass | fail

**Proposed decisions.md** (if structural drift found): …
```

Do not auto-edit `skill/` or `dist/` — propose rebuild or fix, human confirms.

---

## Quality bar

- Git recap must change how someone understands the week (themes + classification), not duplicate `git log`.
- Chat work must produce **actionable** memory candidates or honest “nothing durable found.”
- Apply Omakase Internal Critique Pass on non-trivial synthesis (Context Fidelity: no invented quotes or decisions).
