#!/usr/bin/env node
/**
 * omakase — the chef's standard
 * CLI: skills install, project init, native sub-agent distribution.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const args = process.argv.slice(2);
const command = args[0];
const sub = args[1];

const root = path.resolve(__dirname, '..');
const distRoot = path.join(root, 'dist');
const pkg = require(path.join(root, 'package.json'));
const VERSION = pkg.version;
const { LEAD_IDS } = require(path.join(root, 'scripts/native-agents/generate'));

const LEAD_AGENT_FILES = [...LEAD_IDS].map((id) => `${id}.md`);

const HARNESS_CONFIG = {
  cursor: { dotDir: '.cursor', label: 'Cursor', distName: 'cursor' },
  claude: { dotDir: '.claude', label: 'Claude Code', distName: 'claude' },
  agents: { dotDir: '.agents', label: 'Agents / OpenCode', distName: 'agents' },
  grok: { dotDir: '.grok', label: 'Grok Build', distName: 'grok' },
  codex: { dotDir: '.codex', label: 'Codex', distName: 'codex' },
};

/** Dist subtrees copied on install (relative to dist/<harness>/). */
const DIST_OVERLAYS = {
  cursor: ['.cursor'],
  claude: ['.claude'],
  agents: ['.agents', '.opencode'],
  grok: ['.grok'],
  codex: ['.codex'],
};

const NATIVE_AGENT_GLOBS = {
  '.cursor/agents': 'omakase-',
  '.claude/agents': 'omakase-',
  '.opencode/agents': 'omakase-',
  '.grok/agents': 'omakase-',
  '.codex/agents': 'omakase-',
};

const GLOBAL_NATIVE_PATHS = {
  '.opencode/agents': path.join('.config', 'opencode', 'agents'),
  '.cursor/agents': path.join('.cursor', 'agents'),
  '.claude/agents': path.join('.claude', 'agents'),
  '.codex/agents': path.join('.codex', 'agents'),
};

function detectHarness() {
  const cwd = process.cwd();
  if (fs.existsSync(path.join(cwd, '.grok'))) return 'grok';
  if (fs.existsSync(path.join(cwd, '.cursor'))) return 'cursor';
  if (fs.existsSync(path.join(cwd, '.claude'))) return 'claude';
  if (fs.existsSync(path.join(cwd, '.codex'))) return 'codex';
  if (fs.existsSync(path.join(cwd, '.agents'))) return 'agents';
  return 'agents';
}

function isValidHarness(h) {
  return !!HARNESS_CONFIG[h];
}

function flag(name) {
  return args.includes(name) || args.includes(name.replace('--', '-'));
}

function getSkillFileCount(skillDir) {
  let count = 0;
  function walk(d) {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d)) {
      const p = path.join(d, e);
      const st = fs.statSync(p);
      if (st.isDirectory()) walk(p);
      else count++;
    }
  }
  walk(skillDir);
  return count;
}

function copyRecursive(src, dst) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dst, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
  }
}

function copyDistOverlay(harness, baseDir, options = {}) {
  const cfg = HARNESS_CONFIG[harness];
  const treeSource = path.join(distRoot, cfg.distName);
  const overlays = DIST_OVERLAYS[harness] || [];
  const copied = [];

  for (const overlay of overlays) {
    const src = path.join(treeSource, overlay);
    if (!fs.existsSync(src)) continue;
    const dst = path.join(baseDir, overlay);
    copyRecursive(src, dst);
    copied.push(overlay);
  }

  // Cursor reads .claude/agents/ — prune specialists there and in .cursor only.
  // Do not prune .grok/agents (specialists stay for Grok Task delegation).
  if (harness === 'cursor' || harness === 'claude') {
    const dot = HARNESS_CONFIG[harness].dotDir;
    pruneNonLeadAgentFiles(path.join(baseDir, `${dot}/agents`));
  }

  return copied;
}

/** Grok/Cursor ship leads only; drop legacy specialist files from older installs. */
function pruneNonLeadAgentFiles(agentDir) {
  if (!fs.existsSync(agentDir)) return;
  for (const entry of fs.readdirSync(agentDir)) {
    if (!entry.startsWith('omakase-')) continue;
    const id = entry.replace(/\.(md|toml)$/, '');
    if (!LEAD_IDS.has(id)) {
      fs.rmSync(path.join(agentDir, entry), { force: true });
    }
  }
}

function removeNativeAgents(baseDir, isGlobal = false) {
  let removed = 0;
  for (const dir of nativeAgentDirs(baseDir, isGlobal)) {
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir)) {
      if (!entry.startsWith('omakase-')) continue;
      fs.rmSync(path.join(dir, entry), { force: true });
      removed++;
    }
  }
  return removed;
}

function resolveNativeAgentDir(relDir, isGlobal) {
  if (!isGlobal) return relDir;
  const mapped = GLOBAL_NATIVE_PATHS[relDir];
  return mapped || relDir;
}

function nativeAgentDirs(baseDir, isGlobal) {
  const dirs = [];
  for (const relDir of Object.keys(NATIVE_AGENT_GLOBS)) {
    dirs.push(path.join(baseDir, resolveNativeAgentDir(relDir, isGlobal)));
  }
  if (isGlobal) {
    dirs.push(path.join(os.homedir(), '.config', 'opencode', 'agents'));
  }
  return [...new Set(dirs)];
}

/** Count unique persona ids (not duplicate paths across opencode/codex/cursor). */
function summarizeNativeAgents(baseDir, isGlobal) {
  const ids = new Set();
  const byLocation = {};
  for (const dir of nativeAgentDirs(baseDir, isGlobal)) {
    if (!fs.existsSync(dir)) continue;
    const rel = path.relative(baseDir, dir) || dir;
    const files = fs.readdirSync(dir).filter((e) => e.startsWith('omakase-'));
    if (files.length) byLocation[rel] = files.length;
    for (const f of files) {
      ids.add(f.replace(/\.(md|toml)$/, ''));
    }
  }
  return { unique: ids.size, byLocation, ids: [...ids].sort() };
}

/** Short harness labels for summaries (not full paths). */
function harnessLabelsFromSummary(summary) {
  const labels = [];
  for (const dir of Object.keys(summary.byLocation)) {
    if (dir.includes('opencode')) labels.push('opencode');
    else if (dir.includes('.grok')) labels.push('grok');
    else if (dir.includes('.cursor')) labels.push('cursor');
    else if (dir.includes('.claude')) labels.push('claude');
    else if (dir.includes('.codex')) labels.push('codex');
    else labels.push(dir);
  }
  return [...new Set(labels)];
}

function formatAgentSummary(summary) {
  if (!summary.unique) return 'none';
  const labels = harnessLabelsFromSummary(summary);
  return `${summary.unique} → ${labels.join(', ')}`;
}

function log(msg = '') {
  console.log(msg);
}

function installSkills(targetHarness, options = {}) {
  const harness = targetHarness || detectHarness();
  const isTest = !!options.test;
  const isGlobal = !!options.global;
  const nativeAgents = options.nativeAgents !== false;

  if (targetHarness && !isValidHarness(harness)) {
    log(`error: unknown harness "${targetHarness}"`);
    log('supported: cursor | claude | agents | grok | codex');
    process.exit(1);
  }

  const cfg = HARNESS_CONFIG[harness];
  const treeSource = path.join(distRoot, cfg.distName);
  const dotDirName = cfg.dotDir;
  const marker = path.join(treeSource, dotDirName);

  if (!fs.existsSync(treeSource) || !fs.existsSync(marker)) {
    log(`error: no dist bundle for ${harness} — run npm run build in the omakase repo`);
    process.exit(1);
  }

  const quiet = !!options.quiet;
  const cwd = process.cwd();
  const baseDir = isGlobal ? os.homedir() : cwd;
  const targetDot = path.join(baseDir, dotDirName);
  const skillName = isTest ? 'omakase-test' : 'omakase';
  const targetLabel = isGlobal ? `~/${dotDirName}` : dotDirName;

  if (!quiet) {
    log(`install ${harness} → ${targetLabel}`);
  }

  const copied = copyDistOverlay(harness, baseDir, options);

  // OpenCode global agents live in ~/.config/opencode/agents, not ~/.opencode/agents
  if (isGlobal && harness === 'agents' && nativeAgents) {
    const ocSrc = path.join(treeSource, '.opencode/agents');
    if (fs.existsSync(ocSrc)) {
      const ocDst = path.join(os.homedir(), '.config', 'opencode', 'agents');
      fs.mkdirSync(ocDst, { recursive: true });
      for (const entry of fs.readdirSync(ocSrc)) {
        if (!entry.startsWith('omakase-')) continue;
        copyRecursive(path.join(ocSrc, entry), path.join(ocDst, entry));
      }
      copied.push('~/.config/opencode/agents');
    }
  }

  // Codex bundle is agents-only; installing agents also pulls codex native agents into project
  if (harness === 'agents' && nativeAgents) {
    const codexSrc = path.join(distRoot, 'codex/.codex/agents');
    if (fs.existsSync(codexSrc)) {
      const codexDst = path.join(
        baseDir,
        resolveNativeAgentDir('.codex/agents', isGlobal)
      );
      fs.mkdirSync(codexDst, { recursive: true });
      for (const entry of fs.readdirSync(codexSrc)) {
        if (!entry.startsWith('omakase-')) continue;
        copyRecursive(path.join(codexSrc, entry), path.join(codexDst, entry));
      }
      if (!copied.includes('.codex')) copied.push('.codex/agents');
    }
  }

  if (isTest && harness !== 'codex') {
    const installedDir = path.join(targetDot, 'skills/omakase');
    const testDir = path.join(targetDot, 'skills/omakase-test');
    if (fs.existsSync(installedDir)) {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
      fs.renameSync(installedDir, testDir);
    }
  }

  const nativeSummary = nativeAgents
    ? summarizeNativeAgents(baseDir, isGlobal)
    : { unique: 0, byLocation: {} };

  if (!quiet) {
    const parts = [`skill`];
    if (nativeSummary.unique) parts.push(`${nativeSummary.unique} agents`);
    log(`  ${parts.join(', ')}`);
    if (isTest) log('  test install — remove omakase-test when done');
    else if (!isGlobal) log('  reload your harness to pick up changes');
  }

  return { harness, nativeSummary, copied };
}

function installProjectStack(options = {}) {
  const quiet = !!options.quiet;
  const stackOpts = { ...options, quiet: true };
  // Always install claude + grok + agents (agents also drops codex agents into .codex/agents/)
  const harnesses = ['agents', 'grok', 'claude'];
  if (fs.existsSync(path.join(process.cwd(), '.cursor'))) harnesses.push('cursor');
  if (
    fs.existsSync(path.join(process.cwd(), '.codex')) &&
    !fs.existsSync(path.join(process.cwd(), '.agents'))
  ) {
    harnesses.push('codex');
  }
  if (!quiet) log(`install ${harnesses.join(', ')}`);
  for (const h of harnesses) {
    installSkills(h, stackOpts);
  }
  if (!quiet) {
    const baseDir = options.global ? os.homedir() : process.cwd();
    const summary = summarizeNativeAgents(baseDir, !!options.global);
    log(`  agents: ${formatAgentSummary(summary)}`);
    log('  reload your harness to pick up changes');
  }
  return harnesses;
}

function uninstallSkills(targetHarness, options = {}) {
  const harness = targetHarness || detectHarness();
  const isGlobal = !!options.global;
  const isTest = !!options.test;
  const removeNative = options.nativeAgents !== false;

  if (targetHarness && !isValidHarness(harness)) {
    log(`error: unknown harness "${targetHarness}"`);
    process.exit(1);
  }

  const cfg = HARNESS_CONFIG[harness];
  const baseDir = isGlobal ? os.homedir() : process.cwd();
  const targetDot = path.join(baseDir, cfg.dotDir);
  const skillName = isTest ? 'omakase-test' : 'omakase';
  const skillDir = path.join(targetDot, 'skills', skillName);

  log(`uninstall ${harness}${isGlobal ? ' (global)' : ''}`);

  if (fs.existsSync(skillDir)) {
    fs.rmSync(skillDir, { recursive: true, force: true });
  }

  if (removeNative) {
    removeNativeAgents(baseDir, isGlobal);
  }

  log('  done');
}

function uninstallProjectStack(options = {}) {
  const cwd = process.cwd();
  const isGlobal = !!options.global;
  const baseDir = isGlobal ? os.homedir() : cwd;
  const skillName = options.test ? 'omakase-test' : 'omakase';
  let skillsRemoved = 0;

  log(`uninstall all${isGlobal ? ' (global)' : ''}`);

  for (const h of ['agents', 'grok', 'cursor', 'claude', 'codex']) {
    const skillDir = path.join(baseDir, HARNESS_CONFIG[h].dotDir, 'skills', skillName);
    if (fs.existsSync(skillDir)) {
      fs.rmSync(skillDir, { recursive: true, force: true });
      skillsRemoved++;
    }
  }

  const agentsRemoved =
    options.nativeAgents !== false ? removeNativeAgents(baseDir, isGlobal) : 0;

  log(`  removed ${skillsRemoved} skill tree(s), ${agentsRemoved} agent file(s)`);
}

function initProject(options = {}) {
  const cwd = process.cwd();
  const memDir = path.join(cwd, '.omakaseagent');
  const tastePath = path.join(memDir, 'taste.md');
  const decisionsPath = path.join(memDir, 'decisions.md');
  const agentsPath = path.join(cwd, 'AGENTS.md');
  const today = new Date().toISOString().slice(0, 10);

  log('omakase init');

  fs.mkdirSync(memDir, { recursive: true });

  if (!fs.existsSync(tastePath)) {
    fs.writeFileSync(
      tastePath,
      `# Omakase Taste Memory

## What Good Looks Like Here
- Ruthless simplicity over clever abstractions
- Senior craftsmanship: clear, direct, maintainable
- Non-trivial work explains taste ("Why this approach")
- Critique gate before significant deliverables ship

## What We Reject
- Generic AI tone and filler
- Unnecessary comments and defensive noise
- Files growing past ~1000 lines without justification
- "Future flexibility" abstractions that add cost today

## Current Standards
- Load and cite this file + decisions.md on significant tasks
- Use native Omakase agents: @omakase-engineer, @omakase-critic, @omakase-archivist
`,
      'utf8'
    );
  }

  if (!fs.existsSync(decisionsPath)) {
    fs.writeFileSync(
      decisionsPath,
      `# Key Decisions

## ${today} — Omakase Standard Adopted
**Context**: Project initialized with \`omakase init\`.
**Decision**: Adopt Omakase Rules + Critique Rubric. Use native team leads as primary entry points; specialists are lead-delegated only.
**Why**: Establishes persistent taste memory and senior quality bar from day one.
**Revisit if**: Team changes standards or moves off Omakase.

`,
      'utf8'
    );
  }

  const omakaseSection = `
## Omakase Standards

This project follows the [Omakase](https://github.com/rblalock/omakaseagent) standard — senior craftsmanship, zero AI slop, mandatory critique.

**Native agents (primary entry points):**
- \`@omakase-engineer\` — implementation, architecture, refactoring
- \`@omakase-critic\` — quality enforcement and review
- \`@omakase-archivist\` — memory and decisions

Specialists (\`omakase-senior-reviewer\`, \`omakase-skill-judge\`, etc.) are internal — invoked by leads via Task, not directly.

**Memory:** \`.omakaseagent/taste.md\` and \`.omakaseagent/decisions.md\`

**Fallback router:** \`/omakase-router plan\` / \`/omakase-router taste\` (skill \`omakase-router\` in \`.agents/skills/omakase/\`) — not for lead work.
`;

  if (!fs.existsSync(agentsPath)) {
    fs.writeFileSync(agentsPath, `# AGENTS\n${omakaseSection}`, 'utf8');
  } else {
    const existing = fs.readFileSync(agentsPath, 'utf8');
    if (!existing.includes('## Omakase Standards')) {
      fs.appendFileSync(agentsPath, omakaseSection, 'utf8');
    }
  }

  const installOpts = {
    test: !!options.test,
    global: !!options.global,
    nativeAgents: options.nativeAgents !== false,
  };

  const harnesses = installProjectStack({ ...installOpts, quiet: true });
  const initBase = installOpts.global ? os.homedir() : cwd;
  const nativeSummary = summarizeNativeAgents(initBase, !!installOpts.global);

  log(`  memory:  .omakaseagent/`);
  log(`  agents:  ${formatAgentSummary(nativeSummary)} (${harnesses.join(', ')})`);
  log(`  next:    @omakase-engineer <your task>`);
}

function showHelp() {
  log(`omakase v${VERSION}`);
  log('');
  log('  omakase init [--test] [--global]');
  log('  omakase skills install [cursor|claude|agents|grok|codex] [--test] [--global]');
  log('  omakase skills uninstall [harness] [--global] [--test]');
  log('');
  log('  leads: @omakase-engineer | @omakase-critic | @omakase-archivist');
}

const isTest = flag('--test') || flag('-t');
const isGlobal = flag('--global') || flag('-g');
const noNative = flag('--no-native-agents');
const installOpts = { test: isTest, global: isGlobal, nativeAgents: !noNative };

if (command === 'init') {
  initProject(installOpts);
} else if (command === 'skills' && sub === 'install') {
  const explicit = args[2] && !args[2].startsWith('-') ? args[2] : null;
  if (explicit) {
    installSkills(explicit, installOpts);
  } else {
    installProjectStack(installOpts);
  }
} else if (command === 'skills' && sub === 'uninstall') {
  const explicit = args[2] && !args[2].startsWith('-') ? args[2] : null;
  if (explicit) {
    uninstallSkills(explicit, installOpts);
  } else {
    uninstallProjectStack(installOpts);
  }
} else if (command === 'version' || command === '--version' || command === '-v') {
  console.log(VERSION);
} else if (!command || command === 'help' || command === '--help') {
  showHelp();
} else if (command === 'skills' && (sub === 'help' || !sub)) {
  showHelp();
} else {
  log('error: unknown command — run `omakase help`');
  process.exit(1);
}