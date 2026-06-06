#!/usr/bin/env node
/**
 * Generate harness-native agent definitions from canonical skill/teams/ personas.
 * Emits into dist/* trees at build time. Single source of truth: skill/teams/*.md
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const skillRoot = path.join(root, 'skill');
const teamsRoot = path.join(skillRoot, 'teams');
const corePath = path.join(skillRoot, 'core/omakase-core.md');
const distRoot = path.join(root, 'dist');

const PERSONA_PATHS = [
  'engineering/lead.md',
  'engineering/sub-personas/senior-reviewer.md',
  'engineering/sub-personas/debugger.md',
  'engineering/sub-personas/implementation-lead.md',
  'engineering/sub-personas/refactor-specialist.md',
  'archives/lead.md',
  'archives/sub-personas/memory-synthesizer.md',
  'critics/lead.md',
  'critics/sub-personas/verification-critic.md',
  'critics/sub-personas/structural-critic.md',
  'critics/sub-personas/deslop-critic.md',
  'critics/sub-personas/skill-judge.md',
];

const LEAD_PARENT = {
  engineer: null,
  archivist: null,
  critic: null,
  'senior-reviewer': 'omakase-engineer',
  debugger: 'omakase-engineer',
  'implementation-lead': 'omakase-engineer',
  'refactor-specialist': 'omakase-engineer',
  'memory-synthesizer': 'omakase-archivist',
  'verification-critic': 'omakase-critic',
  'structural-critic': 'omakase-critic',
  'deslop-critic': 'omakase-critic',
  'skill-judge': 'omakase-critic',
};

/** User-invokable leads only; specialists are lead-delegated. */
const LEAD_IDS = new Set(['omakase-engineer', 'omakase-critic', 'omakase-archivist']);

const LEAD_SPECIALISTS = {
  engineer: [
    'omakase-senior-reviewer',
    'omakase-refactor-specialist',
    'omakase-implementation-lead',
    'omakase-debugger',
  ],
  critic: [
    'omakase-deslop-critic',
    'omakase-structural-critic',
    'omakase-verification-critic',
    'omakase-skill-judge',
  ],
  archivist: ['omakase-memory-synthesizer'],
};

/** Relative path from harness agents dir → installed skill tree (after omakase init). */
const SKILL_REL_FROM_AGENTS = {
  opencode: '../../.agents/skills/omakase',
  cursor: '../skills/omakase',
  claude: '../skills/omakase',
  grok: '../skills/omakase',
};

const OUTPUTS = {
  opencode: path.join(distRoot, 'agents/.opencode/agents'),
  cursor: path.join(distRoot, 'cursor/.cursor/agents'),
  claude: path.join(distRoot, 'claude/.claude/agents'),
  grok: path.join(distRoot, 'grok/.grok/agents'),
  codex: path.join(distRoot, 'codex/.codex/agents'),
};

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { meta: {}, body: content.trim() };
  }
  const meta = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (val === 'true') val = true;
    else if (val === 'false') val = false;
    meta[key] = val;
  }
  return { meta, body: match[2].trim() };
}

function loadPersonas() {
  const core = fs.readFileSync(corePath, 'utf8').trim();
  const personas = [];
  for (const rel of PERSONA_PATHS) {
    const filePath = path.join(teamsRoot, rel);
    const raw = fs.readFileSync(filePath, 'utf8');
    const { meta, body } = parseFrontmatter(raw);
    const id = `omakase-${meta.name}`;
    personas.push({
      rel,
      filePath,
      meta,
      body,
      id,
      isLead: meta.role === 'lead',
      parentId: LEAD_PARENT[meta.name] || null,
      readonly: meta.readonly === true,
    });
  }
  return { core, personas };
}

function memberDescription(meta, parentId) {
  return (
    `INTERNAL ONLY — ${meta.team} specialist under ${parentId}. ` +
    `Never user-invokable; only ${parentId} delegates via Task. ` +
    meta.description
  );
}

function leadDescription(meta) {
  return `Omakase — ${meta.lead}. ${meta.description}`;
}

function delegationSection(persona) {
  const specialists = LEAD_SPECIALISTS[persona.meta.name];
  if (!specialists) return '';
  return [
    '',
    '## Native delegation (mandatory when specialists help)',
    '',
    'Use the **Task** tool with `subagent_type` set to the exact agent id below.',
    'Pass a tight charter + relevant `.omakaseagent/` excerpts.',
    '',
    'Allowed specialists:',
    ...specialists.map((id) => `- \`${id}\``),
  ].join('\n');
}

function fileInclude(skillBase, relPath) {
  return `{file:${skillBase}/${relPath}}`;
}

/** Slim body via {file:} includes (OpenCode, Cursor, Claude, Grok). Codex stays inline. */
function buildAgentBody(persona, harness, core) {
  const skillBase = SKILL_REL_FROM_AGENTS[harness];
  if (!skillBase) {
    return buildInlineBody(persona, core);
  }

  const lines = [
    '# Omakase Native Agent',
    '',
    persona.isLead
      ? `You are **${persona.meta.lead}**. Users invoke you as \`${persona.id}\`.`
      : `You are an **internal** specialist under **${persona.parentId}**. Reject undelegated work.`,
    '',
    fileInclude(skillBase, 'core/omakase-core.md'),
    '',
    fileInclude(skillBase, `teams/${persona.rel}`),
  ];
  if (persona.meta.name === 'engineer') {
    lines.push('', fileInclude(skillBase, 'reference/task-intake.md'));
  }
  if (persona.isLead) lines.push(delegationSection(persona));
  return lines.join('\n');
}

function buildInlineBody(persona, core) {
  const lines = [
    '# Omakase Native Agent',
    '',
    persona.isLead
      ? `You are **${persona.meta.lead}**, a first-class Omakase team lead (@${persona.id}).`
      : `You are an **internal** Omakase specialist under **${persona.parentId}**.`,
    '',
    '## Omakase Core (inherited)',
    '',
    core,
    '',
    '## Persona Charter',
    '',
    persona.body,
  ];
  if (persona.isLead) lines.push(delegationSection(persona));
  return lines.join('\n');
}

function opencodeFrontmatter(persona) {
  const desc = persona.isLead
    ? leadDescription(persona.meta)
    : memberDescription(persona.meta, persona.parentId);
  const lines = [
    '---',
    `description: ${yamlQuote(desc)}`,
    `mode: ${persona.isLead ? 'all' : 'subagent'}`,
  ];
  if (!persona.isLead) lines.push('hidden: true');
  lines.push('permission:');
  if (persona.readonly) {
    lines.push('  edit: deny');
    lines.push('  bash: deny');
  }
  if (persona.isLead) {
    const specialists = LEAD_SPECIALISTS[persona.meta.name] || [];
    lines.push('  task:');
    lines.push('    "*": deny');
    for (const id of specialists) {
      lines.push(`    "${id}": allow`);
    }
  } else {
    lines.push('  task: deny');
  }
  lines.push('---');
  return lines.join('\n');
}

function markdownAgentFrontmatter(persona, harness) {
  const desc = persona.isLead
    ? leadDescription(persona.meta)
    : memberDescription(persona.meta, persona.parentId);
  const lines = [
    '---',
    `name: ${persona.id}`,
    `description: ${yamlQuote(desc)}`,
    'model: inherit',
  ];
  if (harness === 'claude') {
    if (persona.readonly || !persona.isLead) {
      lines.push('permissionMode: plan');
    }
    if (!persona.isLead) {
      lines.push('background: true');
    }
  } else if (harness === 'cursor') {
    if (persona.readonly || !persona.isLead) {
      lines.push('readonly: true');
    }
    if (!persona.isLead) {
      lines.push('is_background: true');
    }
  }
  lines.push('---');
  return lines.join('\n');
}

function grokFrontmatter(persona) {
  const desc = persona.isLead
    ? leadDescription(persona.meta)
    : memberDescription(persona.meta, persona.parentId);
  const lines = [
    '---',
    `name: ${persona.id}`,
    'description: >',
    `  ${desc}`,
    'prompt_mode: full',
    'model: inherit',
    `permission_mode: ${persona.readonly || !persona.isLead ? 'plan' : 'default'}`,
    'agents_md: true',
  ];
  lines.push('---');
  return lines.join('\n');
}

function codexToml(persona, body) {
  const desc = persona.isLead
    ? leadDescription(persona.meta)
    : memberDescription(persona.meta, persona.parentId);
  const sandbox = persona.readonly || !persona.isLead ? 'read-only' : 'workspace-write';
  const escaped = body.replace(/\\/g, '\\\\').replace(/"""/g, '\\"\\"\\"');
  return [
    `name = "${persona.id.replace(/-/g, '_')}"`,
    `description = ${tomlQuote(desc)}`,
    `sandbox_mode = "${sandbox}"`,
    'developer_instructions = """',
    escaped,
    '"""',
    '',
  ].join('\n');
}

function yamlQuote(s) {
  if (/[:#\n"'&*]/.test(s) || s.length > 120) {
    return JSON.stringify(s);
  }
  return s;
}

function tomlQuote(s) {
  return JSON.stringify(s);
}

function writeAgentFile(dir, filename, content) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), content, 'utf8');
}

function rimrafFile(p) {
  if (fs.statSync(p).isDirectory()) {
    for (const e of fs.readdirSync(p)) rimrafFile(path.join(p, e));
    fs.rmdirSync(p);
  } else {
    fs.unlinkSync(p);
  }
}

function generateNativeAgents() {
  const { core, personas } = loadPersonas();

  for (const dir of Object.values(OUTPUTS)) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.startsWith('omakase-')) {
        rimrafFile(path.join(dir, f));
      }
    }
  }

  for (const persona of personas) {
    const mdName = `${persona.id}.md`;
    const isLead = LEAD_IDS.has(persona.id);

    writeAgentFile(
      OUTPUTS.opencode,
      mdName,
      `${opencodeFrontmatter(persona)}\n\n${buildAgentBody(persona, 'opencode', core)}\n`
    );
    writeAgentFile(
      OUTPUTS.codex,
      `${persona.id}.toml`,
      codexToml(persona, buildInlineBody(persona, core))
    );

    // User-facing pickers: leads in .cursor / .claude / .grok (Cursor also reads .claude/agents/).
    if (isLead) {
      writeAgentFile(
        OUTPUTS.cursor,
        mdName,
        `${markdownAgentFrontmatter(persona, 'cursor')}\n\n${buildAgentBody(persona, 'cursor', core)}\n`
      );
      writeAgentFile(
        OUTPUTS.claude,
        mdName,
        `${markdownAgentFrontmatter(persona, 'claude')}\n\n${buildAgentBody(persona, 'claude', core)}\n`
      );
      writeAgentFile(
        OUTPUTS.grok,
        mdName,
        `${grokFrontmatter(persona)}\n\n${buildAgentBody(persona, 'grok', core)}\n`
      );
    } else {
      // Specialists: OpenCode (hidden) + Grok (delegation). Not in .claude — Cursor would list them.
      writeAgentFile(
        OUTPUTS.grok,
        mdName,
        `${grokFrontmatter(persona)}\n\n${buildAgentBody(persona, 'grok', core)}\n`
      );
    }
  }

  return { count: personas.length, personas: personas.map((p) => p.id) };
}

if (require.main === module) {
  const result = generateNativeAgents();
  console.log(`Generated ${result.count} native agents: ${result.personas.join(', ')}`);
}

module.exports = {
  generateNativeAgents,
  loadPersonas,
  PERSONA_PATHS,
  OUTPUTS,
  LEAD_IDS,
  LEAD_SPECIALISTS,
};