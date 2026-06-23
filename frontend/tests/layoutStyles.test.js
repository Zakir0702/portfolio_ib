import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const styles = fs.readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

function cssRule(selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = styles.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`, 'm'));

  assert.ok(match, `Expected ${selector} rule to exist`);
  return match[1];
}

test('services and projects section headers center their label and heading area', () => {
  assert.match(cssRule('.services-header'), /text-align:\s*center/);
  assert.match(cssRule('.projects-header'), /justify-content:\s*center/);
  assert.match(cssRule('.projects-headline'), /text-align:\s*center/);
});

test('service preview image stack reserves a stable layer above text content', () => {
  assert.match(cssRule('.hike-images'), /isolation:\s*isolate/);
  assert.match(cssRule('.hike-images'), /display:\s*grid/);
  assert.match(cssRule('.hike-img'), /position:\s*relative/);
});

test('theme color transitions do not override motion transitions on interactive surfaces', () => {
  const themeTransitionRule = styles.match(/\/\* --- Smooth transition of all theme-related colors --- \*\/[\s\S]*?\n\}/)?.[0] || '';

  assert.doesNotMatch(themeTransitionRule, /\.(hike-card|project-card|testimonial-card|btn-primary|btn-secondary|btn-inverse|btn-dark|dark-mode-toggle)\b/);
  assert.match(cssRule('.hike-card'), /transition:[^;]*transform/);
  assert.match(cssRule('.project-card'), /transition:[^;]*transform/);
  assert.match(cssRule('.btn-primary'), /transition:[^;]*transform/);
  assert.match(cssRule('.dark-mode-toggle'), /transition:[^;]*transform/);
});

test('scroll-scrubbed hero content avoids CSS transform transition lag', () => {
  const rule = cssRule('.hero-content[data-appear]');

  assert.match(rule, /transition:\s*opacity/);
  assert.doesNotMatch(rule, /transition:[^;]*transform/);
  assert.match(rule, /will-change:\s*transform,\s*opacity/);
});
