import assert from 'node:assert/strict';
import test from 'node:test';

import { isAdminPath } from '../src/routes.js';

test('detects admin route paths consistently', () => {
  assert.equal(isAdminPath('/admin'), true);
  assert.equal(isAdminPath('/admin/'), true);
  assert.equal(isAdminPath('/admin?tab=media'), true);
  assert.equal(isAdminPath('/admin#media'), true);
  assert.equal(isAdminPath('/'), false);
  assert.equal(isAdminPath('/projects'), false);
});

