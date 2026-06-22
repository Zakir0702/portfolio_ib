import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const indexHtml = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('index declares a favicon that exists in public assets', () => {
  const faviconHref = indexHtml.match(/<link[^>]+rel=["']icon["'][^>]+href=["']([^"']+)["']/)?.[1];

  assert.ok(faviconHref, 'expected index.html to declare a favicon link');
  assert.ok(fs.existsSync(new URL(`../public${faviconHref}`, import.meta.url)), 'expected favicon file to exist');
});
