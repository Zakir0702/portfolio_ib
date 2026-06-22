const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DEFAULT_DATA_FILE = path.join(__dirname, '..', 'data', 'media.json');

function ensureStore(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]', 'utf8');
}

function sanitizeKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function normalizeMediaRecord(input) {
  const now = new Date().toISOString();
  const publicId = input.public_id || input.publicId || input.id || '';
  const key = sanitizeKey(input.key || input.category || input.title || publicId || crypto.randomUUID());

  return {
    id: input.id || publicId || crypto.randomUUID(),
    key,
    type: input.type === 'image' ? 'image' : 'video',
    title: String(input.title || key || 'Untitled media').trim(),
    category: sanitizeKey(input.category || input.type || 'portfolio'),
    url: String(input.url || input.secure_url || ''),
    poster: input.poster || null,
    public_id: publicId,
    format: input.format || null,
    size: Number(input.size || input.bytes || 0),
    width: input.width || null,
    height: input.height || null,
    duration: input.duration || null,
    source: input.source || 'cloudinary',
    created_at: input.created_at || now,
  };
}

function createMediaStore(filePath = process.env.MEDIA_STORE_FILE || DEFAULT_DATA_FILE) {
  function readMedia() {
    ensureStore(filePath);
    try {
      const records = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return Array.isArray(records) ? records.map(normalizeMediaRecord) : [];
    } catch {
      return [];
    }
  }

  function writeMedia(records) {
    ensureStore(filePath);
    fs.writeFileSync(filePath, JSON.stringify(records.map(normalizeMediaRecord), null, 2), 'utf8');
  }

  function addMedia(record) {
    const normalized = normalizeMediaRecord(record);
    const records = readMedia().filter(item => item.id !== normalized.id && item.key !== normalized.key);
    records.unshift(normalized);
    writeMedia(records);
    return normalized;
  }

  function removeMedia(idOrKey) {
    const value = String(idOrKey || '');
    const records = readMedia();
    const next = records.filter(item => item.id !== value && item.key !== value && item.public_id !== value);
    writeMedia(next);
    return records.length !== next.length;
  }

  function findMedia(idOrKey) {
    const value = String(idOrKey || '');
    return readMedia().find(item => item.id === value || item.key === value || item.public_id === value) || null;
  }

  return { readMedia, writeMedia, addMedia, removeMedia, findMedia, filePath };
}

const defaultStore = createMediaStore();

module.exports = {
  createMediaStore,
  normalizeMediaRecord,
  readMedia: defaultStore.readMedia,
  writeMedia: defaultStore.writeMedia,
  addMedia: defaultStore.addMedia,
  removeMedia: defaultStore.removeMedia,
  findMedia: defaultStore.findMedia,
};

