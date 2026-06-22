const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { buildSeedItems, isGitLfsPointer } = require('../scripts/seedMedia');

test('builds seed items from existing local asset files', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-seed-'));
  fs.writeFileSync(path.join(tempDir, 'demo.mp4'), Buffer.from('real video bytes'));
  fs.writeFileSync(path.join(tempDir, 'hero.jpg'), Buffer.from('real image bytes'));

  const items = buildSeedItems(tempDir, [
    { key: 'demo-reel', file: 'demo.mp4', type: 'video', title: 'Demo Reel', category: 'reel' },
    { key: 'hero-image', file: 'hero.jpg', type: 'image', title: 'Hero Image', category: 'hero' },
  ]);

  assert.equal(items.length, 2);
  assert.equal(items[0].key, 'demo-reel');
  assert.equal(items[0].type, 'video');
  assert.equal(items[0].filePath, path.join(tempDir, 'demo.mp4'));
});

test('detects Git LFS pointer files so they are not uploaded as media', () => {
  const pointer = [
    'version https://git-lfs.github.com/spec/v1',
    'oid sha256:20af08db7169d47689253b4dae9293a518a51eb735ff61f55ed4c570ea8f9390',
    'size 40781893',
  ].join('\n');

  assert.equal(isGitLfsPointer(Buffer.from(pointer)), true);
  assert.equal(isGitLfsPointer(Buffer.from('real video bytes')), false);
});

