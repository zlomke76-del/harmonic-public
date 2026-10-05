const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
for (const slug of ['v113-complete-information-successor', 'v114-execution-boundary', 'v116-pack-boundary-invariance']) {
  const dir = `evidence/examinations/${slug}`;
  const entries = fs.readFileSync(path.join(root, dir, 'SHA256SUMS.txt'), 'utf8').trim().split('\n');
  const names = [];
  for (const line of entries) {
    const match = /^([a-f0-9]{64})  ([A-Za-z0-9_.-]+)$/.exec(line);
    assert.ok(match, `invalid checksum entry: ${line}`);
    const [, digest, name] = match;
    assert.ok(!names.includes(name), `duplicate entry: ${name}`); names.push(name);
    const bytes = fs.readFileSync(path.join(root, dir, name));
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), digest, `${slug}/${name}`);
  }
  assert.deepEqual(names.sort(), fs.readdirSync(path.join(root, dir)).filter(n => n !== 'SHA256SUMS.txt').sort(), 'all distributed files must be manifested');
  for (const name of fs.readdirSync(path.join(root, dir))) {
    assert.ok(fs.readFileSync(path.join(root, dir, name)).equals(fs.readFileSync(path.join(root, 'public', dir, name))), `mirror mismatch: ${slug}/${name}`);
  }
}
for (const name of ['index.html', 'docs.html', 'v113-complete-information-successor.html', 'v114-execution-boundary.html', 'v116-pack-boundary-invariance.html']) {
  const bytes = fs.readFileSync(path.join(root, name));
  assert.ok(bytes.equals(fs.readFileSync(path.join(root, 'public', name))), `page mirror mismatch: ${name}`);
  for (const [, href] of bytes.toString().matchAll(/href="(\/[^"#?]*)"/g)) {
    if (href !== '/') assert.ok(fs.existsSync(path.join(root, href.slice(1))), `missing local link: ${href}`);
  }
}
console.log('PASS: V113/V114/V116 published checksums, complete manifests, mirrored files, and local page links');
