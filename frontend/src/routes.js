export function isAdminPath(pathname = '/') {
  const path = String(pathname || '/').split(/[?#]/)[0].replace(/\/+$/, '');
  return path === '/admin';
}

