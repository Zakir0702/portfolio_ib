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
