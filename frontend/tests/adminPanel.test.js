import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const appSource = fs.readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
const adminPanelPath = new URL('../src/components/AdminPanel.jsx', import.meta.url);

test('App renders the admin panel on the /admin route', () => {
  assert.match(appSource, /AdminPanel/);
  assert.match(appSource, /isAdminPath/);
  assert.match(appSource, /window\.location\.pathname/);
});

test('AdminPanel wires the media management workflow', () => {
  assert.equal(fs.existsSync(adminPanelPath), true, 'Expected AdminPanel component to exist');

  const source = fs.readFileSync(adminPanelPath, 'utf8');

  assert.match(source, /fetchAdminMedia/);
  assert.match(source, /uploadAdminMedia/);
  assert.match(source, /deleteAdminMedia/);
  assert.match(source, /sessionStorage/);
  assert.match(source, /URL\.createObjectURL/);
});
