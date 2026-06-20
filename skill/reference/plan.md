# Plan — Senior Planning with Domain Awareness

`plan` is a core command. It produces plans that a strong senior engineer or team would actually want to follow.

Like `critique`, it is a smart traffic-cop: it detects the nature of the request, merges the appropriate standards, and then delivers a high-signal plan with explicit reasoning.

## Core Principle

A mediocre plan is worse than no plan. Every Omakase plan must itself pass the Critique Rubric (core + relevant merged extensions) before being delivered.

## Detection & Merge Logic

**Strong signals to merge Engineering extensions** (from `reference/engineering.md`):
- Implementation, architecture, refactoring, performance, system design, "how should we build X"
- Code, modules, boundaries, tech choices, team process around code
- Any request that will result in significant code or technical decisions
- "Sketch the core data model", "API surface", "backend service" or similar technical depth

**Strong Prose / Writing signals** (merge `reference/prose.md` extensions — do not merge engineering extensions unless technical architecture is in scope):
- Writing, narrative, or copy-focused requests: "develop the messaging", "write the strategy brief for execs", "critique this customer email sequence for voice", "edit this draft", "remove AI voice from this doc"
- Pure product strategy, GTM, positioning, ICP/pricing, exec briefs, one-pagers with explicit or implied "high-level" or "no implementation details" framing
- Process or org design **when the deliverable is primarily prose** (operating rhythm doc, customer communication plan)

**Non-Engineering without prose-heavy output** (core standards only — no engineering, no prose extensions):
- Abstract planning where the plan itself is not a writing artifact and synthetic voice is not the risk (e.g. a bare milestone table)

**Mixed / Ambiguous (common)**:
- When the request combines product/strategy with any meaningful technical architecture, data model, or implementation implications → merge engineering extensions for the relevant portions only.
- When in doubt (e.g., "plan improvements to the developer platform" or "add X feature" without clear qualifiers), **ask once** rather than guessing: "This plan request blends product strategy with potential technical elements. Should I produce a plan under core Omakase standards only, or merge in engineering standards (ruthless simplicity for architecture, boundary hygiene, etc.) for the technical sections?"

When in doubt, ask once rather than guessing the register. The plan output must always include an explicit Domain Detection & Merge note near the top (see required elements below).

## What a Senior Omakase Plan Must Contain

A good plan is not a list of tasks. It is a clear, reasoned artifact that reduces ambiguity and surfaces the important thinking.

Required elements:

1. **Domain Detection & Merge Declaration** (mandatory, placed early — right after Goal Restatement or as a top callout box): Explicitly state the detected domain and merge decision with reasoning. Examples:
   - "Domain: Pure product strategy / GTM. Standards: Core + Prose extensions (phrase/structure deslop, taste.md voice). Reason: Request was high-level positioning and launch phases with no technical architecture."
   - "Domain: Mixed (product positioning + technical implementation sketch). Standards: Core + Engineering extensions (data model/API sections) + Prose extensions (messaging sections). Reason: Explicit request for both strategy copy and core data model/API surface."
   This fulfills the requirement that every plan (and its subsequent critique) transparently documents whether engineering standards were correctly avoided or applied.
2. **Problem / Goal Restatement** (sharper and more precise than the original request)
3. **Key Constraints & Non-Goals** (what we are deliberately *not* doing and why)
4. **Recommended Approach** with explicit "Why this approach" section (trade-offs, why this shape over obvious alternatives)
5. **Options Considered** (at least the main 2-3 alternatives and why they were rejected or deferred)
6. **Risks, Assumptions & Open Questions**
7. **Proposed Phasing / Order of Work** (with justification — not just a flat list)
8. **Success Criteria** (observable, testable outcomes)
9. **Handoff Notes** (what the implementer needs to know that isn't in the plan itself)

## Quality Bar

- Ruthless simplicity in the *plan itself*. Bloated plans are a smell.
- The plan must pass the Critique Rubric (core + prose extensions for writing-heavy plans; core + engineering when the plan contains meaningful technical decisions; both when mixed).
- The plan itself must satisfy `reference/prose.md` Baseline — plans are prose and must not ship with synthetic AI voice.
- Every non-obvious recommendation must have "Why this approach" reasoning.
- The Domain Detection & Merge Declaration must itself be accurate and defensible (this is part of the self-critique gate).
- The plan should feel like it was written by someone who has actually shipped similar work and knows where things usually go wrong.

## Tone

Calm, senior, decisive but not arrogant. You are comfortable saying "this is the right shape" while still showing the thinking that led there. You surface uncomfortable trade-offs early.

## Self-Application

The output of `plan` is frequently handed to `engineer` or other agents. Poor plans create expensive downstream problems. Hold the plan to the same standard you would hold the final implementation.

## Relationship to Handoff

When the plan is substantial, consider also producing a crisp handoff document (see `reference/handoff.md`) for the transition from planning to execution.

## Strategic plan vs execution plan

| | Strategic (`reference/plan.md`) | Execution (`.omakaseagent/backlog/`) |
|---|--------------------------------|--------------------------------------|
| **Purpose** | Why, options, trade-offs, phasing | How — steps, excerpts, verify gates |
| **Trigger** | `/omakase-router plan`, shaping direction | Backlog audit selection, "fix X" spec |
| **Audience** | Human + Engineer deciding shape | `omakase-implementation-lead` with zero session context |
| **Template** | Required elements in this file | `reference/execution-plan.md` |
| **Close** | Handoff to Engineer | Factory loop: critic + gate |

A strategic plan may recommend backlog items; Engineer writes execution plans when it's time to spec concrete file-level work (`reference/backlog-audit.md`).
