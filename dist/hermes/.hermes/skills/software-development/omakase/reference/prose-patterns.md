# Prose Pattern Catalog — Conditional Reference

Load this catalog only for explicit humanizing, voice matching, or a deep editorial audit. Routine Omakase prose uses the Baseline in `reference/prose.md`.

**Lineage:** Omakase-authored synthesis informed by [blader/humanizer](https://github.com/blader/humanizer) (MIT), [petergyang/no-ai-slop](https://github.com/petergyang/no-ai-slop) (MIT, Peter Yang), [Wikipedia's Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), and the existing stop-slop-derived Omakase prose rules. These are editing smells, not authorship tests. Diagnose clusters and the underlying prose failure; do not mechanically erase isolated words or punctuation.

## Evidence and specificity

- **Inflated significance** — ordinary facts become pivotal moments, enduring legacies, broader shifts, or evidence of importance without showing a concrete consequence.
- **Prestige without substance** — publications, awards, experts, or follower counts are listed for authority but never tied to a specific claim.
- **Superficial analysis** — trailing `-ing` phrases claim that something is highlighting, reflecting, symbolizing, fostering, or ensuring an idea without evidence.
- **Promotional puffery** — vibrant, groundbreaking, breathtaking, renowned, or must-see language replaces observable detail. Persuasive copy may sell; it still needs a deliberate claim and audience.
- **Vague attribution** — experts, observers, reports, or critics appear without a name, source, or honest statement that attribution is unavailable.
- **Formulaic challenge sections** — generic obstacles and an optimistic future are added because the outline expects them, not because the artifact contains evidence.
- **Speculative gap filling** — missing information becomes a plausible biography, motive, founding date, private preference, or "low profile." State what is unknown or omit it.

## Sentence construction

- **Vocabulary clusters** — several words such as pivotal, landscape, interplay, testament, showcase, foster, or underscore accumulate in a small space. One correct word is not a failure.
- **Copula avoidance** — serves as, stands as, boasts, features, or offers replaces a clearer `is` or `has`.
- **Synonym cycling** — the same subject receives a new label each sentence instead of repeating the clearest term.
- **False ranges** — "from X to Y" joins examples that do not form a meaningful scale or progression.

## Structure and formatting

- **Decorative emphasis** — repeated bold labels, inline-header lists, emojis, or title treatment simulate hierarchy without improving scanning. Project style decides what counts as excess.
- **Fragmented headings** — a heading is followed by a generic sentence that merely restates it before the real content begins.
- **Generic conclusions** — the ending promises a bright future, continued excellence, or exciting times instead of closing on a decision, fact, consequence, or next action.
- **Colon reveal** — a setup clause and colon manufacture suspense before an ordinary claim. State the claim directly unless the format earns the reveal.
- **Diff-anchored documentation** — evergreen docs narrate what was added, changed, or replaced instead of describing the current behavior. Changelogs, migrations, and release notes are intentionally version-scoped.
- **Outline sediment** — sections exist because a template suggested them, even though they contain no distinct claim.

## Manufactured voice

- **Chatbot residue** — greetings, assurances, praise, "I hope this helps," and offers to continue leak into the artifact.
- **Sycophancy** — agreement and praise replace a direct response to the author's actual point.
- **Authority theater** — "the real question," "at its core," or "what truly matters" announces profundity before an ordinary claim.
- **Faux-insight setup** — "what everyone misses" or "the thing nobody tells you" presents a familiar point as hidden knowledge without evidence.
- **Aphorism formulas** — "X is the language/currency/architecture of Y" makes a reusable slogan where a concrete claim belongs.
- **Fake-profound kicker** — an ornamental aphorism or universal lesson closes the piece after its real conclusion. End on the concrete consequence or next action.
- **Fake-candid openings** — "Honestly?", "Real talk," or "Here's the thing" performs intimacy before a routine statement.

## False-positive restraint

Do not flag these alone:

- An em dash, en dash, curly quote, semicolon, formal word, transition, or short emphatic sentence
- Polished grammar, consistent style, or deliberately neutral technical prose
- A rule-of-three list that contains exactly three real items
- Bold, emoji, heading case, or hyphenation required by the product or publication style
- Watched phrases inside quotations, titles, names, code, or examples discussing the phrase itself

Look for clusters, loss of specificity, unsupported claims, or a mismatch with the brief. Project taste outranks generic detection.

## Human signals to preserve

Preserve these when the source actually contains them:

- Specific, unusual, verifiable detail
- Mixed feelings or unresolved tension
- Defensible first-person editorial choices
- Natural variation in sentence length
- Genuine asides, self-corrections, or domain-native humor

Never create these signals from nothing. The semantic lock in `reference/prose.md` governs every rewrite.
