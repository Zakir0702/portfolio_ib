const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { createApp } = require('../app');
const { createMediaStore } = require('../utils/mediaStore');

function listen(app) {
  return new Promise(resolve => {
    const server = app.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function close(server) {
  return new Promise(resolve => server.close(resolve));
}

test('serves dynamic media and legacy videos from the media store', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-routes-'));
  const store = createMediaStore(path.join(tempDir, 'media.json'));
  store.writeMedia([
    {
      id: 'portfolio_ib/demo',
      key: 'demo-reel',
      type: 'video',
      title: 'Demo Reel',
      url: 'https://example.com/demo.mp4',
      public_id: 'portfolio_ib/demo',
      format: 'mp4',
      size: 123,
    },
    {
      id: 'portfolio_ib/hero',
      key: 'hero-image',
      type: 'image',
      title: 'Hero Image',
      url: 'https://example.com/hero.jpg',
      public_id: 'portfolio_ib/hero',
      format: 'jpg',
      size: 456,
    },
  ]);

  const app = createApp({ mediaStore: store });
  const server = await listen(app);
  const base = `http://127.0.0.1:${server.address().port}`;

  try {
    const mediaResponse = await fetch(`${base}/api/media`);
    const mediaBody = await mediaResponse.json();
    assert.equal(mediaResponse.status, 200);
    assert.equal(mediaBody.success, true);
    assert.equal(mediaBody.media.length, 2);

    const videoResponse = await fetch(`${base}/api/videos`);
    const videoBody = await videoResponse.json();
    assert.equal(videoResponse.status, 200);
    assert.equal(videoBody.success, true);
    assert.equal(videoBody.videos.length, 1);
    assert.equal(videoBody.videos[0].key, 'demo-reel');
  } finally {
    await close(server);
  }
});

