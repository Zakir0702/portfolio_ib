import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const heroSource = fs.readFileSync(new URL('../src/components/Hero.jsx', import.meta.url), 'utf8');

test('hero waits for the preloader and animates title characters with GSAP', () => {
  assert.match(heroSource, /useRef/);
  assert.match(heroSource, /preloaderDone/);
  assert.match(heroSource, /splitIntoChars/);
  assert.match(heroSource, /gsap\.to\(chars/);
});

test('hero configures scroll-triggered image and content parallax', () => {
  assert.match(heroSource, /ScrollTrigger/);
  assert.match(heroSource, /hero-scroll-container/);
  assert.match(heroSource, /rotateX/);
  assert.match(heroSource, /scrub:\s*0\.8/);
});

test('hero buttons use sliding label markup', () => {
  assert.match(heroSource, /btn-label-wrap/);
  assert.match(heroSource, /btn-label-top/);
  assert.match(heroSource, /btn-label-bot/);
});
