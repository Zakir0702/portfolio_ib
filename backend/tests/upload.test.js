const assert = require('node:assert/strict');
const test = require('node:test');

const { getMediaKind, isAllowedMimeType, sanitizeText } = require('../middleware/upload');

test('classifies allowed image and video MIME types', () => {
  assert.equal(getMediaKind('video/mp4'), 'video');
  assert.equal(getMediaKind('video/webm'), 'video');
  assert.equal(getMediaKind('image/jpeg'), 'image');
  assert.equal(getMediaKind('image/png'), 'image');
  assert.equal(getMediaKind('application/pdf'), null);
});

test('allows only supported media MIME types', () => {
  assert.equal(isAllowedMimeType('video/mp4'), true);
  assert.equal(isAllowedMimeType('image/webp'), true);
  assert.equal(isAllowedMimeType('text/html'), false);
});

test('sanitizes user-provided media labels', () => {
  assert.equal(sanitizeText('  <script>alert(1)</script> Demo   Reel  '), 'scriptalert(1)/script Demo Reel');
  assert.equal(sanitizeText('', 'fallback'), 'fallback');
  assert.equal(sanitizeText('   ', 'fallback'), 'fallback');
});

