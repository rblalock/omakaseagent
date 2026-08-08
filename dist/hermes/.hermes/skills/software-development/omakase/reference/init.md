# Init — Bootstrap the Omakase Standard in a Project

**Preferred (deterministic):** run the CLI from the project root:

```bash
npx omakaseagent init
# or, in the omakase repo: node bin/omakase.js init
```

This creates `.omakaseagent/`, updates `AGENTS.md`, installs the skill bundle, and registers **native agents** (`omakase-engineer`, `omakase-critic`, `omakase-archivist`, plus hidden/internal specialists) for OpenCode, Cursor, Claude Code, and Codex.

**Next:** talk to a lead — `@omakase-engineer <task>`, `@omakase-critic`, or `@omakase-archivist`.

**Skill fallback:** `/omakase-router init` in a harness chat follows the steps below when the CLI cannot be run — but the CLI path is strongly preferred so native agents are actually on disk.

`omakase init` creates the persistent memory layer and sets the project up to use the standard.

## What It Creates

At minimum:
- `.omakaseagent/` directory at project root
- `.omakaseagent/taste.md` — running record of what good looks like for this project/team and what patterns are rejected
- `.omakaseagent/decisions.md` — key architectural and product decisions with date + "Why"
- `AGENTS.md` (created or enhanced) — lightweight project-level guidance including Omakase team model reference

Optionally (when the project justifies it):
- `.omakaseagent/context/` for additional high-signal reference material
- `.omakaseagent/handoffs/` for saved handoff documents

## Behavior

1. **Detect existing state.**
   - If `.omakaseagent/` already exists, read the current taste and decisions.
   - Ask the user whether they want to refresh / expand the existing memory or leave it alone.
   - Never silently overwrite.

2. **Explore the project (light but real).**
   - Read README, AGENTS.md / CLAUDE.md / any existing standards docs, package.json or equivalent.
   - Note the primary language/stack and any obvious architectural patterns.
   - Form a hypothesis about what "senior work" looks like in this codebase.

3. **Create the .omakaseagent/ directory and files (exact steps).**
   - `mkdir -p .omakaseagent`
   - Write `.omakaseagent/taste.md` using the high-signal starter below (customize the "What Good Looks Like Here" section based on your project exploration in step 2).
   - Write `.omakaseagent/decisions.md` with at least one initial entry capturing the current context + the decision to adopt Omakase.
   - If this repo already has excellent examples (see the ones in this project's own `.omakaseagent/`), use those as the gold standard for tone and density rather than the generic templates.

4. **Explain what was created and why it matters.**
   - Tell the user the exact paths.
   - Show the first few lines of taste.md and decisions.md.
   - Explain that per SKILL.md Setup, these files are now mandatory context for every significant task (with required "Memory consulted" citation).

5. **Generate or enhance AGENTS.md**
   - Create `AGENTS.md` in the project root (or enhance it if it already exists).
   - Add a clear Omakase section that references the core principles and the team model (Engineering, Archives, Critics).
   - Keep the addition lightweight — link to the installed Omakase skill for the full rules and rubric.
   - Example section to add:
     ```markdown
     ## Omakase Standards
     This project follows the Omakase standard (senior craftsmanship, zero AI slop, mandatory critique gate, ruthless simplicity).

     Teams:
     - Engineering (lead: The Engineer) — primary implementation and technical work
     - Archives (lead: The Archivist) — memory, decisions, and knowledge management
     - Critics (lead: The Critic) — cross-cutting quality enforcement

     Use `@omakase-engineer`, `@omakase-critic`, and `@omakase-archivist` once native agents are installed.
     See the installed Omakase skill for the full 12 Rules and Critique Rubric.
     ```

6. **Offer the obvious next step.**
   - Usually: "Now you can say `@omakase-engineer <task>` or just describe what you want built/reviewed/planned."
   - If the project has no prior standards, this is often the moment to do a light first critique or shape a small piece of work so the taste memory gets its first real data point.

**Minimal Seed for First Task (used by SKILL.md when no .omakaseagent/ exists on first significant engineering work, and user elects to proceed without full /omakase init):**
Create only:
- `.omakaseagent/decisions.md` with exactly this starter (customize date/project name):
  ```markdown
  # Key Decisions

  ## YYYY-MM-DD — Core Omakase Standards Adopted
  **Context**: First significant engineering task on a project with no prior .omakaseagent/ memory.
  **Decision**: Adopt core Omakase Rules + Critique Rubric immediately. Full taste.md and richer decisions will be captured on first real body of work or via explicit `/omakase init`.
  **Why**: Prevents total context loss and generic output from the very first deliverable. Matches Rule 5 (Persistent Taste Memory) and the Setup requirement in SKILL.md. A minimal seed is better than none for Context Fidelity.
  **Revisit if**: User runs full init or provides project-specific taste.
  ```
- No taste.md yet (or a 1-line placeholder directing to run init for real preferences).
After creating, tell the user the exact path created and that the next significant output will cite this seed entry. Then proceed with the task under core + engineering (if signals) standards. This is the *only* allowed path for "proceed without init" on first heavy task.

**Gold standard reference:** The `.omakaseagent/taste.md` and `decisions.md` in this very repository (the Omakase source) are the current best examples of the expected density, directness, and "Why" quality. When in doubt during init, bias toward matching that tone rather than the generic templates below.

## Starter taste.md (high-signal template)

```markdown
# Omakase Taste Memory

## What Good Looks Like Here
- [Project-specific observation 1]
- [Project-specific observation 2]
- Ruthless simplicity is valued more than clever abstractions
- Code that a strong mid-level engineer can understand and modify six months later

## What We Reject
- Unnecessary comments that restate the obvious
- Defensive code around trusted paths
- `any` casts used as escape hatches
- Files that grow past ~1000 lines without clear justification
- "For future flexibility" abstractions that add cost today

## Current Standards
- Every non-trivial engineering change includes a short "Why this approach" section
- Critique gate is mandatory before significant work is considered done
- Persistent decisions are recorded in decisions.md
```

## Starter decisions.md (high-signal template)

```markdown
# Key Decisions

## YYYY-MM-DD — Decision Title
**Context**: One sentence on the situation.
**Decision**: What we chose.
**Why**: The senior reasoning (trade-offs, constraints, taste).
**Revisit if**: Conditions under which we would reconsider.

---

(Older decisions go below. Keep the most recent ones near the top.)
```

## Success Criteria for This Command

After running `omakase init`, a new or existing project should have a clean, useful `.omakaseagent/` that the skill will actually consult on future work. The files should feel like they were written by someone with taste, not by a generic template engine.

If the project already has strong standards elsewhere, `init` should acknowledge them and focus on creating the minimal bridge into the Omakase memory layer rather than fighting existing conventions.

## Minimum Seed Content for First-Task / Proactive Seeding (when init is not explicit)

When the router creates a seed on the first significant task (see SKILL.md Routing Logic):
- taste.md must contain **at least three concrete, observable, task-derived entries** (not generic aspirations) in "What Good Looks Like Here" and "What We Reject", pulled directly from the files, request, or smells under discussion in the current turn.
- decisions.md must contain the adoption entry plus the context of the triggering task.
- After writing, the persona must re-read the created files and perform a quick internal rubric pass, recording the result in the output or decisions.md.
- The seed must be high-signal enough that a future agent loading it 10 minutes later can make a better decision on the *same* task than it could with no memory.

Generic one-line placeholders ("Core standards adopted") are a failure of Context Fidelity.
