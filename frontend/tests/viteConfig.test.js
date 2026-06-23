import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const viteConfig = fs.readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');

test('Vite uses the React automatic JSX runtime for production builds', () => {
  assert.match(viteConfig, /@vitejs\/plugin-react/);
  assert.match(viteConfig, /jsxRuntime:\s*['"]automatic['"]/);
});

test('Vite dev server proxies API calls to the backend', () => {
  assert.match(viteConfig, /server:\s*\{/);
  assert.match(viteConfig, /proxy:\s*\{/);
  assert.match(viteConfig, /['"]\/api['"]:\s*['"]http:\/\/127\.0\.0\.1:5000['"]/);
});
