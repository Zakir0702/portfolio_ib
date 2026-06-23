export function normalizeAdminToken(value = '') {
  return String(value).trim().replace(/^Bearer\s+/i, '').trim();
}

export function buildAdminAuthHeaders(token = '') {
  const normalized = normalizeAdminToken(token);
  return normalized ? { Authorization: `Bearer ${normalized}` } : {};
}

async function readJsonResponse(response, fallbackMessage) {
  let body = {};

  try {
    body = await response.json();
  } catch {
    body = {};
  }

  if (!response.ok || body.success === false) {
    throw new Error(body.message || fallbackMessage || `Request failed (${response.status})`);
  }

  return body;
}

export async function fetchAdminMedia({ type = '', category = '', fetcher = globalThis.fetch } = {}) {
  const params = new URLSearchParams();
  if (type) params.set('type', type);
  if (category) params.set('category', category);

  const url = `/api/media${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetcher(url, {
    headers: { Accept: 'application/json' },
  });
  const body = await readJsonResponse(response, 'Unable to load media library.');

  return Array.isArray(body.media) ? body.media : [];
}

export async function uploadAdminMedia({
  token = '',
  title = '',
  key = '',
  category = '',
  file,
  fetcher = globalThis.fetch,
} = {}) {
  if (!file) throw new Error('Choose an image or video before uploading.');

  const formData = new FormData();
  formData.append('media', file);
  if (title) formData.append('title', title);
  if (key) formData.append('key', key);
  if (category) formData.append('category', category);

  const response = await fetcher('/api/media/upload', {
    method: 'POST',
    headers: buildAdminAuthHeaders(token),
    body: formData,
  });

  return readJsonResponse(response, 'Unable to upload media.');
}

export async function deleteAdminMedia(id, { token = '', fetcher = globalThis.fetch } = {}) {
  if (!id) throw new Error('A media id is required before deleting.');

  const response = await fetcher(`/api/media/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: buildAdminAuthHeaders(token),
  });

  return readJsonResponse(response, 'Unable to delete media.');
}

