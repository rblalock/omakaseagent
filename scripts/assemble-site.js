#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');

const root = path.resolve(__dirname, '..');
const distRoot = path.join(root, 'dist');
const sources = [
  path.join(root, 'site'),
  path.join(root, 'dist', 'public'),
];
const zipPath = path.join(root, 'dist', 'omakase-skill.zip');

function isInside(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative);
}

function assembleSite(target, boundary = root) {
  const output = path.resolve(target);
  const safeBoundary = path.resolve(boundary);
  const isProduction = safeBoundary === root;
  const isVerificationTemp =
    path.dirname(safeBoundary) === os.tmpdir() &&
    path.basename(safeBoundary).startsWith('omakase-site-');
  if (!isProduction && !isVerificationTemp) {
    throw new Error(`Unsupported site output boundary: ${safeBoundary}`);
  }
  if (!isInside(safeBoundary, output)) {
    throw new Error(`Site output must be inside ${safeBoundary}: ${output}`);
  }
  if (isProduction && output !== path.join(root, '_site')) {
    throw new Error(`Production site output must be ${path.join(root, '_site')}: ${output}`);
  }
  if (path.dirname(output) !== safeBoundary) {
    throw new Error(`Site output must be a direct child of ${safeBoundary}: ${output}`);
  }

  for (const protectedRoot of [path.join(root, '.git'), sources[0], distRoot]) {
    if (
      output === protectedRoot ||
      isInside(protectedRoot, output) ||
      isInside(output, protectedRoot)
    ) {
      throw new Error(`Refusing to replace protected path: ${output}`);
    }
  }

  for (const source of [...sources, zipPath]) {
    if (!fs.existsSync(source)) {
      throw new Error(`Missing site artifact: ${path.relative(root, source)}; run npm run build`);
    }
  }

  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output, { recursive: true });
  for (const source of sources) {
    fs.cpSync(source, output, { recursive: true });
  }
  fs.copyFileSync(zipPath, path.join(output, 'omakase-skill.zip'));
  return output;
}

if (require.main === module) {
  const target = process.argv[2];
  if (!target) {
    console.error('Usage: node scripts/assemble-site.js <output-directory>');
    process.exit(1);
  }
  const output = assembleSite(target);
  console.log(`Site assembled → ${path.relative(root, output) || output}`);
}

module.exports = { assembleSite };
