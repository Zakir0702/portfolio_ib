import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

function readJson(path) {
  return JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'));
}

function assertAdminSpaRewrites(config) {
  assert.ok(Array.isArray(config.rewrites), 'Expected Vercel rewrites to be configured');
  assert.deepEqual(config.rewrites, [
    { source: '/admin', destination: '/index.html' },
    { source: '/admin/:path*', destination: '/index.html' },
  ]);
}

test('frontend Vercel config rewrites admin routes to the React app', () => {
  assertAdminSpaRewrites(readJson('../vercel.json'));
});

test('root Vercel config rewrites admin routes when project root is repository root', () => {
  assertAdminSpaRewrites(readJson('../../vercel.json'));
});

