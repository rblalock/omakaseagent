# Taste Memory Management

Persistent taste lives in `.omakaseagent/taste.md` and `decisions.md` at the project root.

## Core Contract

- These files are **sacred context**.
- **On every non-trivial task the skill MUST read (or have in active context) both files before reasoning.** "Attempt" or "best-effort" is not sufficient; absence of a read is a process failure.
- The output **must** contain the "Memory consulted" declaration required by SKILL.md Setup.
- After significant work, the skill **must** proactively update (or propose exact patch for) taste.md / decisions.md when new strong preferences or decisions surface, and declare the update in the output ("Updated decisions.md with..."). Updates are part of delivery for non-trivial engineering.

## Reading

- On *every* non-trivial task (engineering or otherwise where project standards apply), read both files early using available tools.
- Weave specific preferences into reasoning ("Given that this project rejects defensive comments...") **and cite the exact entry**.
- If the files are missing but the project would clearly benefit, gently surface the option to run `omakase init`. For first significant engineering work, the calling skill (per SKILL.md) creates a minimal seed decisions.md before or instead of asking.

## Writing / Updating

- Never overwrite the user's voice. Add, refine, or sharpen.
- New entries in `taste.md` should be specific and observable ("We reject X because it caused Y in the past").
- `decisions.md` entries must always include **Context**, **Decision**, **Why**, and **Revisit if**.
- Keep both files relatively small and high-signal. Summarize or archive when they grow.

### Voice memory (only when observed)

When a project has a real recurring voice, store a compact `## Voice` section in `taste.md`: sentence rhythm, vocabulary, punctuation, first-person scope, warmth, humor, and audience-specific differences. Derive it from explicit user direction or representative project artifacts; never invent a voice profile from generic preferences.

Store the actionable profile and its scope, not the user's full private writing sample. A named sample supplied for one task does not become durable project memory unless the user asks.

## Quality Bar for Taste Entries

An entry is good when a future agent (or human) can read it in 30 seconds and make meaningfully better decisions on the next piece of work.

Vague or aspirational entries ("we like clean code") are low value and should be sharpened or removed.

## Relationship to the Critique Rubric

Taste memory is one of the primary mechanisms for achieving **Context Fidelity** across sessions. Weak or absent memory is a recurring source of generic output.
