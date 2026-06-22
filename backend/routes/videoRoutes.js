const express = require('express');
const { requireAdminToken } = require('../middleware/adminAuth');
const defaultMediaStore = require('../utils/mediaStore');
const { deleteCloudinaryMedia } = require('../utils/cloudinaryUpload');
const { createMediaUploadHandler, mediaUpload } = require('./mediaRoutes');

function createVideoRoutes({ mediaStore = defaultMediaStore } = {}) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const videos = mediaStore.readMedia().filter(item => item.type === 'video');
    res.json({ success: true, count: videos.length, videos });
  });

  router.get('/:id', (req, res) => {
    const media = mediaStore.findMedia(decodeURIComponent(req.params.id));
    if (!media || media.type !== 'video') {
      return res.status(404).json({ success: false, message: 'Video not found.' });
    }
    return res.json({ success: true, video: media });
  });

  router.post('/upload', requireAdminToken, mediaUpload, createMediaUploadHandler({ mediaStore, forcedType: 'video' }));

  router.delete('/:id', requireAdminToken, async (req, res, next) => {
    try {
      const id = decodeURIComponent(req.params.id);
      const media = mediaStore.findMedia(id);
      if (!media || media.type !== 'video') {
        return res.status(404).json({ success: false, message: 'Video not found.' });
      }

      await deleteCloudinaryMedia(media.public_id || media.id, 'video');
      mediaStore.removeMedia(id);
      return res.json({ success: true, message: 'Video deleted.' });
    } catch (err) {
      return next(err);
    }
  });

  return router;
}

module.exports = createVideoRoutes;

