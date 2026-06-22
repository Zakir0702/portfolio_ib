import assert from 'node:assert/strict';
import test from 'node:test';

import { createMediaResolver, mergeMedia } from '../src/api/media.js';

test('mergeMedia prefers API media over local fallback by key', () => {
  const merged = mergeMedia(
    [
      { key: 'demo-reel', type: 'video', url: 'https://cloudinary.example/demo.mp4' },
      { key: 'hero-image', type: 'image', url: 'https://cloudinary.example/hero.jpg' },
    ],
    {
      'demo-reel': { key: 'demo-reel', type: 'video', url: '/assets/demo.mp4' },
      'avatar': { key: 'avatar', type: 'image', url: '/assets/log.JPG.jpeg' },
    }
  );

  assert.equal(merged['demo-reel'].url, 'https://cloudinary.example/demo.mp4');
  assert.equal(merged['avatar'].url, '/assets/log.JPG.jpeg');
});

test('createMediaResolver returns fallback when API media is unavailable', () => {
  const resolveMedia = createMediaResolver({}, {
    'project-travel': { key: 'project-travel', type: 'image', url: '/assets/tajmahal.jpg' },
  });

  assert.equal(resolveMedia('project-travel').url, '/assets/tajmahal.jpg');
  assert.equal(resolveMedia('missing-key').url, '');
});

