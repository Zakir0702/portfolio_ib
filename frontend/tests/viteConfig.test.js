import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const viteConfig = fs.readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');

test('Vite uses the React automatic JSX runtime for production builds', () => {
  assert.match(viteConfig, /@vitejs\/plugin-react/);
  assert.match(viteConfig, /jsxRuntime:\s*['"]automatic['"]/);
});
