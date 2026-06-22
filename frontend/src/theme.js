export function readStoredTheme(storage = globalThis.localStorage) {
  try {
    return storage?.getItem('theme') === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function applyThemePreference(theme, { root = globalThis.document?.documentElement, storage = globalThis.localStorage } = {}) {
  const resolvedTheme = theme === 'dark' ? 'dark' : 'light';

  if (root) {
    if (resolvedTheme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }

  try {
    storage?.setItem('theme', resolvedTheme);
  } catch {
    // Storage can be unavailable in private or restricted browsing modes.
  }

  return resolvedTheme;
}
