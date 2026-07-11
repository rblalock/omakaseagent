#!/usr/bin/env node
/**
 * Mechanical scenario evals against skill/native contracts.
 * See evals/*.eval.json and evals/README.md
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const evalsDir = path.join(root, 'evals');

function loadEvals() {
  if (!fs.existsSync(evalsDir)) return [];
  return fs
    .readdirSync(evalsDir)
    .filter((f) => f.endsWith('.eval.json'))
    .map((f) => {
      const full = path.join(evalsDir, f);
      const spec = JSON.parse(fs.readFileSync(full, 'utf8'));
      return { file: f, spec };
    });
}

function checkTarget(rootDir, target, evalId) {
  const filePath = path.join(rootDir, target.path);
  const rel = target.path;
  const errors = [];

  if (!fs.existsSync(filePath)) {
    errors.push(`${evalId}: missing target file ${rel}`);
    return errors;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  for (const pattern of target.mustMatch || []) {
    const re = new RegExp(pattern, 'm');
    if (!re.test(content)) {
      errors.push(`${evalId}: ${rel} must match /${pattern}/`);
    }
  }
  for (const pattern of target.mustNotMatch || []) {
    const re = new RegExp(pattern, 'm');
    if (re.test(content)) {
      errors.push(`${evalId}: ${rel} must NOT match /${pattern}/`);
    }
  }
  return errors;
}

function main() {
  const evals = loadEvals();
  if (evals.length === 0) {
    console.error('verify:scenario-evals — no evals/*.eval.json found');
    process.exit(1);
  }

  let failed = false;
  for (const { file, spec } of evals) {
    const id = spec.id || file.replace('.eval.json', '');
    const errors = [];
    for (const target of spec.targets || []) {
      errors.push(...checkTarget(root, target, id));
    }
    if (errors.length) {
      console.error(`✗ ${id} (${file})`);
      for (const e of errors) console.error(`    ${e}`);
      failed = true;
    } else {
      console.log(`✓ ${id} — ${spec.title || id}`);
    }
  }

  if (failed) process.exit(1);
  console.log(`All ${evals.length} scenario eval(s) passed.`);
}

main();
