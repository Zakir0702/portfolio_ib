const multer = require('multer');

const VIDEO_MIME_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']);
const IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_FILE_SIZE_MB = Number(process.env.MAX_UPLOAD_MB || 100);

const storage = multer.memoryStorage();

function getMediaKind(mimetype) {
  if (VIDEO_MIME_TYPES.has(mimetype)) return 'video';
  if (IMAGE_MIME_TYPES.has(mimetype)) return 'image';
  return null;
}

function isAllowedMimeType(mimetype) {
  return Boolean(getMediaKind(mimetype));
}

function sanitizeText(value, fallback = '') {
  const text = String(value || '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text || fallback;
}

const fileFilter = (req, file, cb) => {
  if (isAllowedMimeType(file.mimetype)) {
    cb(null, true);
  } else {
    const err = new Error(`Unsupported file type: ${file.mimetype}. Allowed: mp4, webm, mov, avi, jpg, png, webp, gif`);
    err.status = 415;
    cb(err, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
});

module.exports = upload;
module.exports.getMediaKind = getMediaKind;
module.exports.isAllowedMimeType = isAllowedMimeType;
module.exports.sanitizeText = sanitizeText;
module.exports.MAX_FILE_SIZE_MB = MAX_FILE_SIZE_MB;
