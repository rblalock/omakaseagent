# Skill Judge — SKILL.md evaluation rubric

Use this reference when auditing agent skills, `SKILL.md` packages, persona markdown, or third-party imports before they merge into Omakase. This complements the Omakase Critique Rubric for code and artifacts; it does not replace it.

**Policy (non-negotiable):** Report-only. Never block merges, installs, or releases on a numeric grade. The Critic delivers the report; the human decides.

## When to run

- "Evaluate this skill", "audit SKILL.md", "score this persona"
- Before siphoning an external skill into `skill/teams/` or `skill/reference/`
- After generating or changing project agents (`omakase learn` → `.omakaseagent/project-agents/`)
- Dark-factory Phase 4: mechanical contracts in `evals/*.eval.json` (`npm run verify:scenario-evals`); live with/without-skill runs per `reference/team-architecture.md` trigger table

## Evaluation protocol

**Fixes obey `reference/write-skills.md`** — leading words, failure-mode diagnosis, edit pass. Map each critical issue to a named failure mode when applicable.

1. **Knowledge delta scan (first pass).** For each major section, tag:
   - **[E] Expert** — the model/harness genuinely benefits; keep
   - **[A] Activation** — known material, but a brief reminder helps activation; keep if short
   - **[R] Redundant** — tutorial filler the model already knows; delete or compress
2. **Structure check** — frontmatter validity, description quality, line count, progressive disclosure, reference files that actually load
3. **Score eight dimensions** — evidence per dimension, not vibes
4. **Grade** — total out of 120; assign A–F
5. **Report** — required output shape below; run Omakase Internal Critique Pass on the report itself

## Eight dimensions (120 points)

| ID | Dimension | Max | What it measures |
|----|-----------|-----|------------------|
| D1 | Knowledge delta | 20 | Expert-only content vs token waste (core dimension) |
| D2 | Mindset + procedures | 15 | Thinking patterns and workflows the harness would not infer |
| D3 | Anti-pattern quality | 15 | Explicit NEVER lists with non-obvious reasons |
| D4 | Specification compliance | 15 | Frontmatter, description (WHAT / WHEN / keywords), activation |
| D5 | Progressive disclosure | 15 | Layered loading; body vs references; "do not load" guards |
| D6 | Freedom calibration | 15 | Constraint level matches task fragility (creative vs brittle ops) |
| D7 | Pattern fit | 10 | Matches a deliberate pattern (see below) |
| D8 | Practical usability | 15 | Decision trees, examples, error paths an agent can follow |

**Leading words (fold into D1/D2):** Does the skill anchor behavior with compact concepts in description + body? Restated prose where one word would suffice is a deduction.

**Completion criteria (fold into D8):** Are step done-conditions checkable and exhaustive where it matters? Vague "produce a plan" without done shape → premature-completion risk.

### Grades

| Grade | Score | Meaning |
|-------|-------|---------|
| A | 108+ (90%+) | Production-ready expert skill |
| B | 96–107 | Good; minor fixes |
| C | 84–95 | Adequate; clear improvement path |
| D | 72–83 | Significant issues |
| F | &lt;72 | Redesign likely |

### Design patterns (D7)

| Pattern | ~Lines | Best for |
|---------|--------|----------|
| Mindset | ~50 | Taste-heavy creative work |
| Navigation | ~30 | Distinct scenarios, routing |
| Philosophy | ~150 | Originality-heavy creation |
| Process | ~200 | Multi-step projects |
| Tool | ~300 | Precise format or API operations |

Wrong pattern for the job is a D7 failure even if prose is polished.

## Common failure patterns (flag explicitly)

Align names with `reference/write-skills.md` where they overlap.

1. **Tutorial** — explains basics the model already knows  
2. **Dump** — everything in one 800+ line file  
3. **Orphan references** — linked files never reached in workflow  
4. **Checkbox procedure** — steps without thinking frameworks  
5. **Vague warning** — "be careful" without invariant or example  
6. **Invisible skill** — strong body, weak `description` (activation fails)  
7. **Wrong location** — trigger guidance only in body, not description  
8. **Over-engineered package** — auxiliary files without load path  
9. **Freedom mismatch** — rigid scripts for creative work, or loose prose for fragile ops  
10. **Premature completion** — step ends before checkable done  
11. **Embargo** — withholds findings to honor step order  
12. **Lucky pass** — relies on user volunteering unprompted context  
13. **War story** — one-bug play-by-play instead of transferable smell  
14. **Implementation index** — line numbers and literals that rot  
15. **Sediment** — stale layers never pruned  
16. **No-op** — sentences the model already obeys  
17. **Stage compression** — later steps completed without opening their reference

## Omakase alignment checks

In addition to the 120-point rubric, note pass/fail on:

- **Zero slop** — generic AI voice, filler, engagement bait
- **Expert-only default** — no menu of 18 shallow skills when one lead + delegation would do
- **Native agent fit** — if this is a persona: correct `description`, lead-only specialists, no user-facing duplicate of a lead
- **Memory contract** — significant skills mention when to read/update `.omakaseagent/` if project-scoped

## Required report shape

```markdown
# Skill Evaluation Report: [name]

## Summary
- **Total score**: X/120 (Y%)
- **Grade**: [A|B|C|D|F]
- **Pattern**: [Mindset|Navigation|Philosophy|Process|Tool|Mixed|None]
- **Knowledge ratio**: E:A:R = e:a:r
- **Verdict**: [one sentence]

## Dimension scores
| Dimension | Score | Max | Notes |
|-----------|-------|-----|-------|

## Critical issues
- [must-fix, with location]

## Top 3 improvements
1. ...
2. ...
3. ...

## Omakase alignment
- [bullet findings]

## Internal Critique Pass
[1–2 sentences on this report; issues found or none]
```

## Example report (abbreviated)

```markdown
# Skill Evaluation Report: omakase-router

## Summary
- **Total score**: 108/120 (90%)
- **Grade**: A
- **Pattern**: Navigation
- **Knowledge ratio**: E:A:R = 8:2:0
- **Verdict**: Thin router with strong precedence and pointers; suitable after native-agent install.

## Critical issues
- none

## Top 3 improvements
1. Keep body under ~150 lines as references grow.
```

## Lineage

Rubric distilled from [softaworks/agent-toolkit skill-judge](https://github.com/softaworks/agent-toolkit/tree/main/skills/skill-judge) (MIT). Authoring bar from [dzhng/skills `write-skills`](https://github.com/dzhng/skills) (MIT) via `reference/write-skills.md`. Rewritten for Omakase voice and report-only policy.
