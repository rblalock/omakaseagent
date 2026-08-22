#!/usr/bin/env node

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const { unzipSync } = require('fflate');
const { assembleSite } = require('./assemble-site');
const { createServer } = require('./serve-site');

const root = path.resolve(__dirname, '..');
const canonicalUrl = 'https://omakaseagent.com/';
const chatSkillPath = path.join(root, 'dist/chat/omakase/SKILL.md');
const publicRoot = path.join(root, 'dist/public');
const publicSkillPath = path.join(
  publicRoot,
  '.well-known/agent-skills/omakase/SKILL.md'
);
const indexPath = path.join(
  publicRoot,
  '.well-known/agent-skills/index.json'
);

function sha256(bytes) {
  return `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`;
}

function request(port, pathname, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { hostname: '127.0.0.1', port, path: pathname, method },
      (res) => {
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => resolve({
          body: Buffer.concat(chunks),
          headers: res.headers,
          status: res.statusCode,
        }));
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function verify() {
  const chatSkill = fs.readFileSync(chatSkillPath);
  const publicSkill = fs.readFileSync(publicSkillPath);
  assert.deepStrictEqual(publicSkill, chatSkill, 'public SKILL.md differs from chat artifact');
  const zip = unzipSync(fs.readFileSync(path.join(root, 'dist/omakase-skill.zip')));
  assert.deepStrictEqual(
    Buffer.from(zip['omakase/SKILL.md']),
    publicSkill,
    'downloadable zip SKILL.md differs from public artifact'
  );

  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  assert.strictEqual(
    index.$schema,
    'https://schemas.agentskills.io/discovery/0.2.0/schema.json'
  );
  assert.strictEqual(index.skills.length, 1);
  assert.deepStrictEqual(
    {
      name: index.skills[0].name,
      type: index.skills[0].type,
      url: index.skills[0].url,
      digest: index.skills[0].digest,
    },
    {
      name: 'omakase',
      type: 'skill-md',
      url: '/.well-known/agent-skills/omakase/SKILL.md',
      digest: sha256(publicSkill),
    }
  );

  const description = publicSkill.toString().match(/^description:\s*(.+)$/m)?.[1];
  assert.strictEqual(index.skills[0].description, description);

  const indexHtml = fs.readFileSync(path.join(root, 'site/index.html'), 'utf8');
  assert.match(indexHtml, /<link rel="canonical" href="https:\/\/omakaseagent\.com\/">/);

  const robots = fs.readFileSync(path.join(root, 'site/robots.txt'), 'utf8');
  assert.strictEqual(
    robots,
    `User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: Claude-SearchBot
User-agent: Claude-User
Allow: /
Content-Signal: ai-train=no, search=yes, ai-input=yes

User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
Disallow: /
Content-Signal: ai-train=no, search=yes, ai-input=yes

User-agent: *
Allow: /
Content-Signal: ai-train=no, search=yes, ai-input=yes

Sitemap: https://omakaseagent.com/sitemap.xml
`
  );

  const sitemap = fs.readFileSync(path.join(root, 'site/sitemap.xml'), 'utf8');
  assert.deepStrictEqual(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]),
    [canonicalUrl]
  );

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'omakase-site-'));
  try {
    const assembled = assembleSite(path.join(tempRoot, 'public'), tempRoot);
    assert.deepStrictEqual(
      fs.readFileSync(path.join(assembled, '.well-known/agent-skills/index.json')),
      fs.readFileSync(indexPath)
    );
    assert.deepStrictEqual(
      fs.readFileSync(path.join(assembled, '.well-known/agent-skills/omakase/SKILL.md')),
      publicSkill
    );
    assert.deepStrictEqual(
      fs.readFileSync(path.join(assembled, 'omakase-skill.zip')),
      fs.readFileSync(path.join(root, 'dist/omakase-skill.zip'))
    );
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  for (const unsafeTarget of ['.', '..', 'docs', 'site/preview', 'dist/preview']) {
    assert.throws(
      () => assembleSite(path.join(root, unsafeTarget)),
      /output|protected/,
      `assembler accepted unsafe target ${unsafeTarget}`
    );
  }
  assert.throws(
    () => assembleSite(path.join(os.homedir(), 'site-output'), os.homedir()),
    /Unsupported site output boundary/,
    'assembler accepted a caller-controlled home boundary'
  );

  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const port = server.address().port;
  try {
    const cases = [
      ['/robots.txt', 'text/plain; charset=utf-8'],
      ['/sitemap.xml', 'application/xml; charset=utf-8'],
      ['/.well-known/agent-skills/index.json', 'application/json; charset=utf-8'],
      ['/.well-known/agent-skills/omakase/SKILL.md', 'text/markdown; charset=utf-8'],
      ['/omakase-skill.zip', 'application/zip'],
    ];
    for (const [pathname, contentType] of cases) {
      const response = await request(port, pathname);
      assert.strictEqual(response.status, 200, `${pathname} did not return 200`);
      assert.strictEqual(response.headers['content-type'], contentType);

      const head = await request(port, pathname, 'HEAD');
      assert.strictEqual(head.status, 200, `HEAD ${pathname} did not return 200`);
      assert.strictEqual(head.body.length, 0, `HEAD ${pathname} returned a body`);
      assert.strictEqual(
        head.headers['content-type'],
        response.headers['content-type'],
        `HEAD ${pathname} changed Content-Type`
      );
      assert.strictEqual(
        head.headers['content-length'],
        response.headers['content-length'],
        `HEAD ${pathname} changed Content-Length`
      );
    }
  } finally {
    await new Promise(resolve => server.close(resolve));
  }

  console.log('verify:site — discovery files, digest, assembly, and local HTTP parity pass');
}

verify().catch(error => {
  console.error(error.stack || error.message);
  process.exit(1);
});
