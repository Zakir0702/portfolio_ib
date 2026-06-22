require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { addMedia } = require('../utils/mediaStore');
const { uploadMediaBuffer } = require('../utils/cloudinaryUpload');

const DEFAULT_MANIFEST = [
  { key: 'demo-reel', file: 'demo.mp4', type: 'video', title: 'Demo Reel', category: 'reel' },
  { key: 'hero-image', file: 'horse.jpeg', type: 'image', title: 'Hero Image', category: 'hero' },
  { key: 'avatar', file: 'log.JPG.jpeg', type: 'image', title: 'Ibrahim Shamshad', category: 'profile' },
  { key: 'project-travel', file: 'tajmahal.jpg', type: 'image', title: 'Cinematic Travel Film', category: 'project' },
  { key: 'project-brand', file: 'edits.JPG.jpeg', type: 'image', title: 'Brand Story Film', category: 'project' },
  { key: 'project-mountain', file: 'shangarh.jpg', type: 'image', title: 'Mountain Documentary', category: 'project' },
  { key: 'project-photography', file: 'photography.jpg', type: 'image', title: 'Photography Preview', category: 'project' },
];

function isGitLfsPointer(buffer) {
  const text = buffer.toString('utf8', 0, Math.min(buffer.length, 200));
  return text.startsWith('version https://git-lfs.github.com/spec/v1');
}

function buildSeedItems(assetRoot, manifest = DEFAULT_MANIFEST) {
  return manifest
    .map(item => ({
      ...item,
      filePath: path.join(assetRoot, item.file),
    }))
    .filter(item => fs.existsSync(item.filePath));
}

function assertCloudinaryConfigured() {
  const missing = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
    .filter(name => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing Cloudinary environment variables: ${missing.join(', ')}`);
  }
}

async function seedMedia({ assetRoot = path.join(__dirname, '..', '..', 'frontend', 'public', 'assets'), dryRun = false } = {}) {
  const items = buildSeedItems(assetRoot);
  if (!dryRun) assertCloudinaryConfigured();

  const results = [];

  for (const item of items) {
    const buffer = fs.readFileSync(item.filePath);
    const isPointer = isGitLfsPointer(buffer);
    const summary = {
      key: item.key,
      type: item.type,
      title: item.title,
      file: item.file,
      filePath: item.filePath,
      size: buffer.length,
      skipped: false,
      reason: null,
    };

    if (isPointer) {
      results.push({ ...summary, skipped: true, reason: 'git-lfs-pointer' });
      continue;
    }

    if (dryRun) {
      results.push({ ...summary, skipped: true, reason: 'dry-run' });
      continue;
    }

    const uploaded = await uploadMediaBuffer(buffer, item);
    const saved = addMedia(uploaded);
    results.push({ ...summary, media: saved });
  }

  return results;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const results = await seedMedia({ dryRun });
  console.log(JSON.stringify({ dryRun, count: results.length, results }, null, 2));
}

if (require.main === module) {
  main().catch(err => {
    console.error(err.message);
    process.exit(1);
  });
}

module.exports = {
  DEFAULT_MANIFEST,
  buildSeedItems,
  isGitLfsPointer,
  seedMedia,
};
