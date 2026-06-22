import assert from 'node:assert/strict';
import test from 'node:test';

import { applyThemePreference, readStoredTheme } from '../src/theme.js';

function createRootStub() {
  const attributes = new Map();

  return {
    attributes,
    setAttribute(name, value) {
      attributes.set(name, String(value));
    },
    removeAttribute(name) {
      attributes.delete(name);
    },
    getAttribute(name) {
      return attributes.has(name) ? attributes.get(name) : null;
    },
  };
}

function createStorageStub(initialTheme) {
  const values = new Map(initialTheme ? [['theme', initialTheme]] : []);

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
  };
}

test('applyThemePreference writes the dark value required by CSS selectors', () => {
  const root = createRootStub();
  const storage = createStorageStub();

  applyThemePreference('dark', { root, storage });

  assert.equal(root.getAttribute('data-theme'), 'dark');
  assert.equal(storage.getItem('theme'), 'dark');
});

test('applyThemePreference removes the theme attribute when switching back to light', () => {
  const root = createRootStub();
  const storage = createStorageStub('dark');

  applyThemePreference('dark', { root, storage });
  applyThemePreference('light', { root, storage });

  assert.equal(root.getAttribute('data-theme'), null);
  assert.equal(storage.getItem('theme'), 'light');
});

test('readStoredTheme only restores supported theme values', () => {
  assert.equal(readStoredTheme(createStorageStub('dark')), 'dark');
  assert.equal(readStoredTheme(createStorageStub('blue')), 'light');
  assert.equal(readStoredTheme(createStorageStub()), 'light');
});
