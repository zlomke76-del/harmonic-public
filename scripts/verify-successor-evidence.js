const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');

const slugs = [
  'v113-complete-information-successor',
  'v114-execution-boundary',
  'v116-pack-boundary-invariance',
  'v117-source-standing',
  'v118-registry-authority-standing',
  'v120-authority-chain-continuity',
  'v121-authority-scope-sufficiency',
  'v122-authority-precedence',
];

function walkFiles(dir, prefix = '') {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${ent.name}` : ent.name;
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walkFiles(abs, rel));
    else out.push(rel);
  }
  return out;
}

for (const slug of slugs) {
  const dir = `evidence/examinations/${slug}`;
  const absDir = path.join(root, dir);
  const entries = fs.readFileSync(path.join(absDir, 'SHA256SUMS.txt'), 'utf8').trim().split('\n').filter(Boolean);
  const names = [];
  for (const line of entries) {
    const match = /^([a-f0-9]{64})  (.+)$/.exec(line);
    assert.ok(match, `invalid checksum entry: ${line}`);
    const [, digest, name] = match;
    assert.ok(!names.includes(name), `duplicate entry: ${name}`); names.push(name);
    const bytes = fs.readFileSync(path.join(absDir, name));
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), digest, `${slug}/${name}`);
  }
  const distributed = walkFiles(absDir).filter(n => n !== 'SHA256SUMS.txt').sort();
  assert.deepEqual(names.sort(), distributed, `${slug}: all distributed files must be manifested`);
  for (const name of walkFiles(absDir)) {
    assert.ok(fs.readFileSync(path.join(absDir, name)).equals(fs.readFileSync(path.join(root, 'public', dir, name))), `mirror mismatch: ${slug}/${name}`);
  }
}

for (const name of [
  'index.html', 'docs.html',
  'v113-complete-information-successor.html', 'v114-execution-boundary.html',
  'v116-pack-boundary-invariance.html', 'v117-source-standing.html',
  'v118-registry-authority-standing.html', 'v120-authority-chain-continuity.html',
  'v121-authority-scope-sufficiency.html', 'v122-authority-precedence.html'
]) {
  const bytes = fs.readFileSync(path.join(root, name));
  assert.ok(bytes.equals(fs.readFileSync(path.join(root, 'public', name))), `page mirror mismatch: ${name}`);
  for (const [, href] of bytes.toString().matchAll(/href="(\/[^"#?]*)"/g)) {
    if (href !== '/') assert.ok(fs.existsSync(path.join(root, href.slice(1))), `missing local link: ${href}`);
  }
}
console.log('PASS: V113/V114/V116/V117/V118/V120/V121/V122 published checksums, complete manifests, mirrored files, and local page links');
