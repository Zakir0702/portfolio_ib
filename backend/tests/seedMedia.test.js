const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { buildSeedItems, isGitLfsPointer, seedMedia } = require('../scripts/seedMedia');

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

test('continues seeding when one upload fails and records the error', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-seed-continue-'));
  fs.writeFileSync(path.join(tempDir, 'demo.mp4'), Buffer.from('video bytes'));
  fs.writeFileSync(path.join(tempDir, 'hero.jpg'), Buffer.from('image bytes'));

  const manifest = [
    { key: 'demo-reel', file: 'demo.mp4', type: 'video', title: 'Demo Reel', category: 'reel' },
    { key: 'hero-image', file: 'hero.jpg', type: 'image', title: 'Hero Image', category: 'hero' },
  ];

  const results = await seedMedia({
    assetRoot: tempDir,
    manifest,
    existingMedia: [],
    uploadFn: async (buffer, item) => {
      if (item.key === 'demo-reel') throw new Error('Request Timeout');
      return { id: 'cloudinary/hero', key: item.key, type: item.type, title: item.title, url: 'https://example.com/hero.jpg' };
    },
    saveFn: record => record,
  });

  assert.equal(results.length, 2);
  assert.equal(results[0].skipped, true);
  assert.equal(results[0].reason, 'upload-failed');
  assert.equal(results[0].error, 'Request Timeout');
  assert.equal(results[1].skipped, false);
  assert.equal(results[1].media.url, 'https://example.com/hero.jpg');
});

test('skips existing media keys unless force is enabled', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-seed-existing-'));
  fs.writeFileSync(path.join(tempDir, 'hero.jpg'), Buffer.from('image bytes'));

  const manifest = [
    { key: 'hero-image', file: 'hero.jpg', type: 'image', title: 'Hero Image', category: 'hero' },
  ];

  const results = await seedMedia({
    assetRoot: tempDir,
    manifest,
    existingMedia: [{ key: 'hero-image', url: 'https://example.com/existing.jpg' }],
    uploadFn: async () => {
      throw new Error('should not upload');
    },
  });

  assert.equal(results.length, 1);
  assert.equal(results[0].skipped, true);
  assert.equal(results[0].reason, 'already-seeded');
});

test('can seed only selected keys', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-seed-key-'));
  fs.writeFileSync(path.join(tempDir, 'demo.mp4'), Buffer.from('video bytes'));
  fs.writeFileSync(path.join(tempDir, 'hero.jpg'), Buffer.from('image bytes'));

  const manifest = [
    { key: 'demo-reel', file: 'demo.mp4', type: 'video', title: 'Demo Reel', category: 'reel' },
    { key: 'hero-image', file: 'hero.jpg', type: 'image', title: 'Hero Image', category: 'hero' },
  ];

  const uploaded = [];
  const results = await seedMedia({
    assetRoot: tempDir,
    manifest,
    onlyKeys: ['hero-image'],
    existingMedia: [],
    uploadFn: async (buffer, item) => {
      uploaded.push(item.key);
      return { id: item.key, key: item.key, type: item.type, title: item.title, url: `https://example.com/${item.file}` };
    },
    saveFn: record => record,
  });

  assert.deepEqual(uploaded, ['hero-image']);
  assert.equal(results.length, 1);
  assert.equal(results[0].key, 'hero-image');
});
