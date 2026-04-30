const express     = require('express');
const streamifier = require('streamifier');
const cloudinary  = require('../config/cloudinary');
const upload      = require('../middleware/upload');
const { readVideos, writeVideos } = require('../utils/videoStore');

const router = express.Router();

/* ─── Helper: upload buffer → Cloudinary ─── */
function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

/* ─────────────────────────────────────────────────
   POST /api/videos/upload
   Body (multipart/form-data):
     video  — required, video file
     title  — optional, display title
   ───────────────────────────────────────────────── */
router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No video file provided.' });
    }

    const title = (req.body.title || req.file.originalname).trim();

    const result = await uploadToCloudinary(req.file.buffer, {
      resource_type: 'video',
      folder:        'portfolio_ib',
      public_id:     `video_${Date.now()}`,
      overwrite:     false,
      // Auto-generate a thumbnail poster
      eager: [{ width: 800, crop: 'scale', format: 'jpg' }],
    });

    const videoRecord = {
      id:         result.public_id,
      title,
      url:        result.secure_url,
      poster:     result.eager?.[0]?.secure_url || null,
      duration:   result.duration  || null,
      format:     result.format,
      size:       result.bytes,
      created_at: new Date().toISOString(),
    };

    const videos = readVideos();
    videos.unshift(videoRecord);      // newest first
    writeVideos(videos);

    res.status(201).json({ success: true, video: videoRecord });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────
   GET /api/videos
   Returns all uploaded videos (newest first)
   ───────────────────────────────────────────────── */
router.get('/', (req, res) => {
  const videos = readVideos();
  res.json({ success: true, count: videos.length, videos });
});

/* ─────────────────────────────────────────────────
   GET /api/videos/:id
   Returns a single video by Cloudinary public_id
   ───────────────────────────────────────────────── */
router.get('/:id', (req, res) => {
  const videos = readVideos();
  const id     = decodeURIComponent(req.params.id);
  const video  = videos.find(v => v.id === id);

  if (!video) {
    return res.status(404).json({ success: false, message: 'Video not found.' });
  }
  res.json({ success: true, video });
});

/* ─────────────────────────────────────────────────
   DELETE /api/videos/:id
   Deletes from Cloudinary + local store
   ───────────────────────────────────────────────── */
router.delete('/:id', async (req, res) => {
  try {
    const id = decodeURIComponent(req.params.id);

    await cloudinary.uploader.destroy(id, { resource_type: 'video' });

    const videos  = readVideos();
    const updated = videos.filter(v => v.id !== id);
    writeVideos(updated);

    res.json({ success: true, message: 'Video deleted.' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
