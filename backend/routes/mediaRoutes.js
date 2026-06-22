const express = require('express');
const upload = require('../middleware/upload');
const { getMediaKind, sanitizeText } = require('../middleware/upload');
const { requireAdminToken } = require('../middleware/adminAuth');
const defaultMediaStore = require('../utils/mediaStore');
const { deleteCloudinaryMedia, uploadMediaBuffer } = require('../utils/cloudinaryUpload');

const mediaUpload = upload.fields([
  { name: 'media', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]);

function getUploadedFile(req) {
  if (req.file) return req.file;
  const groups = Object.values(req.files || {});
  return groups.flat()[0] || null;
}

function getPublicMedia(mediaStore, req) {
  const type = req.query.type ? String(req.query.type).toLowerCase() : '';
  const category = req.query.category ? String(req.query.category).toLowerCase() : '';

  return mediaStore.readMedia().filter(item => {
    if (type && item.type !== type) return false;
    if (category && item.category !== category) return false;
    return true;
  });
}

function createMediaUploadHandler({ mediaStore = defaultMediaStore, forcedType = null } = {}) {
  return async (req, res, next) => {
    try {
      const file = getUploadedFile(req);
      if (!file) {
        return res.status(400).json({ success: false, message: 'No media file provided.' });
      }

      const detectedType = getMediaKind(file.mimetype);
      const type = forcedType || detectedType;
      if (!type || (forcedType && detectedType !== forcedType)) {
        return res.status(415).json({ success: false, message: 'Uploaded file type does not match this endpoint.' });
      }

      const title = sanitizeText(req.body.title, file.originalname);
      const key = sanitizeText(req.body.key, title).toLowerCase().replace(/[^a-z0-9-_]+/g, '-');
      const category = sanitizeText(req.body.category, type).toLowerCase().replace(/[^a-z0-9-_]+/g, '-');

      const mediaRecord = await uploadMediaBuffer(file.buffer, {
        key,
        type,
        title,
        category,
      });
      const saved = mediaStore.addMedia(mediaRecord);

      return res.status(201).json({ success: true, media: saved });
    } catch (err) {
      return next(err);
    }
  };
}

function createMediaRoutes({ mediaStore = defaultMediaStore } = {}) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const media = getPublicMedia(mediaStore, req);
    res.json({ success: true, count: media.length, media });
  });

  router.get('/:id', (req, res) => {
    const media = mediaStore.findMedia(decodeURIComponent(req.params.id));
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found.' });
    }
    return res.json({ success: true, media });
  });

  router.post('/upload', requireAdminToken, mediaUpload, createMediaUploadHandler({ mediaStore }));

  router.delete('/:id', requireAdminToken, async (req, res, next) => {
    try {
      const id = decodeURIComponent(req.params.id);
      const media = mediaStore.findMedia(id);
      if (!media) {
        return res.status(404).json({ success: false, message: 'Media not found.' });
      }

      await deleteCloudinaryMedia(media.public_id || media.id, media.type);
      mediaStore.removeMedia(id);

      return res.json({ success: true, message: 'Media deleted.' });
    } catch (err) {
      return next(err);
    }
  });

  return router;
}

module.exports = {
  createMediaRoutes,
  createMediaUploadHandler,
  getUploadedFile,
  mediaUpload,
};

