import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildAdminAuthHeaders,
  deleteAdminMedia,
  fetchAdminMedia,
  normalizeAdminToken,
  uploadAdminMedia,
} from '../src/api/adminMedia.js';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

test('normalizes admin tokens before building authorization headers', () => {
  assert.equal(normalizeAdminToken('  secret-token  '), 'secret-token');
  assert.equal(normalizeAdminToken('Bearer secret-token'), 'secret-token');
  assert.deepEqual(buildAdminAuthHeaders('secret-token'), { Authorization: 'Bearer secret-token' });
  assert.deepEqual(buildAdminAuthHeaders(''), {});
});

test('uploadAdminMedia posts multipart media with admin authorization', async () => {
  let request;
  const file = new Blob(['demo video'], { type: 'video/mp4' });

  const result = await uploadAdminMedia({
    token: 'secret-token',
    title: 'Demo Reel',
    key: 'demo-reel',
    category: 'reel',
    file,
    fetcher: async (url, options) => {
      request = { url, options };
      return jsonResponse({ success: true, media: { key: 'demo-reel' } }, 201);
    },
  });

  assert.equal(request.url, '/api/media/upload');
  assert.equal(request.options.method, 'POST');
  assert.equal(request.options.headers.Authorization, 'Bearer secret-token');
  assert.equal(request.options.body.get('title'), 'Demo Reel');
  assert.equal(request.options.body.get('key'), 'demo-reel');
  assert.equal(request.options.body.get('category'), 'reel');
  assert.ok(request.options.body.get('media') instanceof Blob);
  assert.equal(result.media.key, 'demo-reel');
});

test('fetchAdminMedia applies filters and returns media records', async () => {
  let requestedUrl = '';

  const media = await fetchAdminMedia({
    type: 'image',
    category: 'project',
    fetcher: async url => {
      requestedUrl = url;
      return jsonResponse({ success: true, media: [{ key: 'project-image' }] });
    },
  });

  assert.equal(requestedUrl, '/api/media?type=image&category=project');
  assert.equal(media[0].key, 'project-image');
});

test('deleteAdminMedia deletes an encoded media id with admin authorization', async () => {
  let request;

  const result = await deleteAdminMedia('portfolio_ib/demo reel', {
    token: 'secret-token',
    fetcher: async (url, options) => {
      request = { url, options };
      return jsonResponse({ success: true, message: 'Media deleted.' });
    },
  });

  assert.equal(request.url, '/api/media/portfolio_ib%2Fdemo%20reel');
  assert.equal(request.options.method, 'DELETE');
  assert.equal(request.options.headers.Authorization, 'Bearer secret-token');
  assert.equal(result.message, 'Media deleted.');
});

