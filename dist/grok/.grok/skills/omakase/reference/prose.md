# Prose — Anti-Slop for Writing

Use this reference whenever an artifact is primarily **prose**: emails, docs, strategy briefs, GTM copy, READMEs, handoffs, memory entries, agent responses to humans, and user-facing strings.

**Attribution:** Phrase and structure catalogs adapted from [stop-slop](https://github.com/hardikpandya/stop-slop) (MIT, Hardik Pandya). Omakase applies them under the Critique Rubric with project taste overrides — we did **not** adopt absolute bans on all adverbs or all em dashes.

## Who applies this (non-negotiable)

**Every Omakase agent** applies at least the **Baseline** below on any prose it writes or edits — not only Critics.

| Agent / surface | How |
|---------------|-----|
| **All personas** (inherit `omakase-core`) | Baseline on every response, handoff, and memory update |
| **@omakase-engineer** + specialists | Baseline on comments, READMEs, gate sections, PR text; full extensions when the deliverable is prose-heavy |
| **@omakase-critic** + Deslop Critic | Full extensions when reviewing or rewriting prose |
| **@omakase-archivist** + Memory Synthesizer | Full extensions on taste/decisions/synthesis (high signal, no synthetic voice) |
| **Router** (`plan`, `critique`, smart chef) | Merge prose extensions per detection rules in `reference/critique.md` and `reference/plan.md` |

Critique and dedicated deslop passes use the **full extensions**. Implementation agents apply baseline **while typing** — same spirit as pervasive code deslop in `reference/engineering.md`.

## When to merge (critique / plan)

**Strong prose signals** — merge these extensions additively (do **not** merge engineering extensions unless code/architecture is also in scope):

- "edit this draft", "remove AI voice", "humanize", "review this email/doc/post"
- Product strategy, GTM, positioning, messaging, voice and tone, exec brief, one-pager
- Customer communication, narrative writing, process design docs, blog/README copy
- Critique or plan for writing where implementation depth is absent or disclaimed

**Mixed** (e.g. README + API design): merge prose extensions for prose sections; engineering extensions only for technical sections. Declare both in Domain Detection & Merge.

**Engineering-only** (code review, refactor): do **not** merge prose extensions as the primary lens; still apply baseline to any prose in the deliverable (commit message, PR description, comments).

## Baseline (every agent, every prose output)

Before shipping prose:

1. **State the point.** No throat-clearing ("Here's the thing", "Let me be clear", "It's worth noting").
2. **Name actors and specifics.** No false agency ("the decision emerges") or vague declaratives ("the implications are significant").
3. **Active voice by default.** Find who did what; passive only when the actor truly does not matter.
4. **Respect `taste.md`.** Brand voice wins over generic "directness" — terse chef register vs warmer customer email is a Context Fidelity choice, not slop.
5. **Cut performative AI voice.** Hedging stacks, business jargon filler, meta-commentary about the document's own structure, engagement bait.
6. **Earned personality is not slop.** Project-native metaphor, justified first person, and sharp opinions are allowed when `taste.md` or the brief calls for them — distinguish from synthetic enthusiasm.

## Full extensions (critique, deslop pass, prose-heavy authoring)

### Phrase patterns — remove or replace

**Throat-clearing:** "Here's what/this/that…", "The uncomfortable truth is", "It turns out", "Let me be clear", "The truth is,", "Can we talk about", "In order to…", "It is important to note that…"

**Emphasis crutches:** "Full stop.", "Period.", "Let that sink in.", "Make no mistake", "This matters because"

**Business jargon** (prefer plain words): navigate → handle; unpack → explain; lean into → accept; landscape → situation; game-changer → significant; deep dive → review; circle back → revisit; moving forward → next

**Filler frames:** "At its core", "In today's [X]", "At the end of the day", "When it comes to", "In a world where", "The reality is"

**Meta-commentary:** "Hint:", "Plot twist:", "Let me walk you through…", "In this section we'll…", "As we'll see…", "The rest of this essay…"

**Hedging intensifiers** (cut when they add no meaning): really, just, literally, genuinely, honestly, simply, actually, deeply, truly, fundamentally, crucially, importantly

**Vague declaratives** (replace with the specific thing): "The reasons are structural", "The stakes are high", "The implications are significant"

### Structural patterns — break or rewrite

| Pattern | Problem | Fix |
|---------|---------|-----|
| "Not X. It's Y." / "The answer isn't X. It's Y." | Telegraphed reversal | State Y directly |
| "Not a X… Not a Y… A Z." | Negative listing / striptease | State Z |
| "[Noun]. That's it. That's the [thing]." | Dramatic fragmentation | Complete sentences |
| "What if…?" / "Think about it:" | Rhetorical setup | Make the point |
| Inanimate subject + human verb | False agency | Name the person or use "you" |
| "Nobody designed this." / "People tend to…" | Narrator-from-a-distance | Put the reader in the scene |
| Rule-of-three lists everywhere | Metronomic AI rhythm | Two items or one; vary length |
| Every paragraph ends punchy | Predictable cadence | Vary endings |
| Lazy extremes (every, always, never, everyone) | False authority | Use specifics |

**Em dashes:** Prefer commas or periods when the dash is habitual filler. Em dashes are not banned — overuse is the smell.

**Adverbs:** Cut empty -ly emphasis; keep adverbs that change meaning ("solely", "legally", "publicly").

### Quick pre-ship checklist

- Throat-clearing or "here's what" openers? → Cut to the point.
- Passive voice hiding the actor? → Name the actor.
- Binary contrast or negative listing? → State the positive claim.
- False agency or narrator floating above the scene? → Specific human or "you".
- Three same-length sentences in a row? → Break one.
- Pull-quote sentence that sounds like LinkedIn? → Rewrite plain.
- Jargon or hedging stack? → Plain words, one claim per sentence.
- Does it still match `taste.md` voice? → If not, fix fidelity before more deletion.

## Prose-specific critique extensions

When merged, additionally evaluate:

- **Phrase density** — How many banned/opening/jargon patterns per screen?
- **Structural tells** — Binary contrasts, false agency, meta-commentary, dramatic fragmentation?
- **Directness** — Statements vs announcements?
- **Rhythm** — Varied vs metronomic?
- **Trust** — Respects reader intelligence without hand-holding?
- **Density** — Anything cuttable without losing necessary precision?

Optional lightweight score (1–10 each, revise if total &lt; 35/50): Directness, Rhythm, Trust, Authenticity, Density. Map failures to **Zero AI Slop** and **Taste & Voice** in the core rubric.

## How you work (Deslop Critic or any agent doing a prose pass)

1. Read full context + `.omakaseagent/taste.md` (voice rules are binding).
2. Scan for deletions first — same deletion lens as code deslop.
3. List instances with location + before/after (or minimal rewrite).
4. One tight sentence per item: which pattern and which rubric bullet it violates.
5. Preserve meaning, legal qualifiers, and required uncertainty; do not "humanize" into vagueness.
6. Surface Internal Critique Pass on the cleaned artifact.

## Examples

**Before:** "Here's the thing: building products is hard. Not because the technology is complex. Because people are complex. Let that sink in."

**After:** "Building products is hard. Technology is manageable. People aren't."

**Before:** "The decision emerges when stakeholders align on the strategic landscape."

**After:** "Product ships when you and the leads agree on scope."

**Before:** "In today's fast-paced landscape, we need to lean into discomfort and navigate uncertainty with clarity."

**After:** "Move faster. Name what you don't know."

## Guardrails

- Do not strip trust-boundary warnings, legal language, accessibility text, or necessary caveats as "hedging."
- Do not flatten intentional brand voice documented in `taste.md` or `PRODUCT.md`.
- Do not confuse **humanizer-style soul** (justified opinion, mess, first person) with **slop** (performative enthusiasm, fake intimacy) — when the brief wants narrative voice, prefer `humanizer` patterns over sterile compression.
- If unsure whether a phrase is slop vs required precision, escalate to The Critic or cite the open question — do not guess.

## Relationship to engineering deslop

| | Code (`engineering.md`) | Prose (this file) |
|---|---------------------------|-------------------|
| **Target** | Comments, defensive code, `any`, nesting | Sentences, structure, voice |
| **When** | Engineering persona / code critique | Writing artifacts + all agent prose |
| **Merge together?** | Only on mixed artifacts; declare both domains |