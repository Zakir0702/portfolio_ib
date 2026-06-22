export function mergeMedia(apiMedia = [], fallbackMedia = {}) {
  const merged = { ...fallbackMedia };

  for (const item of apiMedia) {
    if (!item?.key || !item.url) continue;
    merged[item.key] = {
      ...merged[item.key],
      ...item,
    };
  }

  return merged;
}

export function createMediaResolver(apiMediaByKey = {}, fallbackMedia = {}) {
  const merged = mergeMedia(Object.values(apiMediaByKey), fallbackMedia);

  return function resolveMedia(key) {
    return merged[key] || { key, type: 'unknown', url: '', poster: null };
  };
}

export async function fetchMedia() {
  const response = await fetch('/api/media', {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Unable to load media (${response.status})`);
  }

  const body = await response.json();
  return Array.isArray(body.media) ? body.media : [];
}

export function mapMediaByKey(media = []) {
  return media.reduce((acc, item) => {
    if (item?.key) acc[item.key] = item;
    return acc;
  }, {});
}

