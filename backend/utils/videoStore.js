const fs   = require('fs');
const path = require('path');

// data/ lives inside the backend folder
const DATA_FILE = path.join(__dirname, '..', 'data', 'videos.json');

function ensureStore() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir))  fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}

function readVideos() {
  ensureStore();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeVideos(videos) {
  ensureStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify(videos, null, 2), 'utf8');
}

module.exports = { readVideos, writeVideos };
