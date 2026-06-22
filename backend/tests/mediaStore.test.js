const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { createMediaStore, normalizeMediaRecord } = require('../utils/mediaStore');

test('normalizes Cloudinary media records for frontend consumption', () => {
  const record = normalizeMediaRecord({
    key: 'hero-video',
    type: 'video',
    title: 'Demo Reel',
    url: 'https://res.cloudinary.com/demo/video/upload/demo.mp4',
    poster: 'https://res.cloudinary.com/demo/video/upload/demo.jpg',
    public_id: 'portfolio_ib/demo',
    format: 'mp4',
    size: 40781893,
    category: 'reel',
    duration: 18.5,
    source: 'cloudinary',
  });

  assert.equal(record.key, 'hero-video');
  assert.equal(record.type, 'video');
  assert.equal(record.title, 'Demo Reel');
  assert.equal(record.url, 'https://res.cloudinary.com/demo/video/upload/demo.mp4');
  assert.equal(record.poster, 'https://res.cloudinary.com/demo/video/upload/demo.jpg');
  assert.equal(record.public_id, 'portfolio_ib/demo');
  assert.equal(record.category, 'reel');
  assert.equal(record.duration, 18.5);
  assert.equal(record.source, 'cloudinary');
  assert.match(record.created_at, /^\d{4}-\d{2}-\d{2}T/);
});

test('persists newest media first and preserves existing records', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-media-'));
  const filePath = path.join(tempDir, 'media.json');
  const store = createMediaStore(filePath);

  const first = store.addMedia({
    key: 'image-1',
    type: 'image',
    title: 'Hero Image',
    url: 'https://example.com/hero.jpg',
    public_id: 'portfolio_ib/hero',
    format: 'jpg',
    size: 1024,
  });

  const second = store.addMedia({
    key: 'video-1',
    type: 'video',
    title: 'Showreel',
    url: 'https://example.com/reel.mp4',
    public_id: 'portfolio_ib/reel',
    format: 'mp4',
    size: 2048,
  });

  const records = store.readMedia();

  assert.equal(records.length, 2);
  assert.equal(records[0].id, second.id);
  assert.equal(records[1].id, first.id);
  assert.deepEqual(JSON.parse(fs.readFileSync(filePath, 'utf8')), records);
});

