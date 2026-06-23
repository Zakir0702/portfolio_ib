import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const navbarSource = fs.readFileSync(new URL('../src/components/Navbar.jsx', import.meta.url), 'utf8');

test('navbar exposes an admin link on desktop and mobile navigation', () => {
  assert.match(navbarSource, /\['\/admin',\s*'Admin'\]/);
  assert.match(navbarSource, /href=\{href\}/);
  assert.match(navbarSource, /mobile-link/);
});

