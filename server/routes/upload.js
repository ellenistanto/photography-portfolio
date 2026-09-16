const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');

const isVercel = !!process.env.VERCEL;

// Ensure uploads directory exists for local development
let uploadDir = null;
if (!isVercel) {
  try {
    uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  } catch (_e) {
    uploadDir = null;
  }
}

// Storage configuration: disk on local dev (if writable), memory on Vercel/serverless
let storage;
if (!isVercel && uploadDir) {
  storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeBase = path.basename(file.originalname, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 30);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
      cb(null, `${safeBase}-${uniqueSuffix}${ext}`);
    },
  });
} else {
  storage = multer.memoryStorage();
}

// Allowed mime types for image uploads
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
];

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipe file tidak didukung: ${file.mimetype}. Harap gunakan file gambar (JPG, PNG, WEBP, GIF, AVIF).`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB max
  },
});

/**
 * POST /api/upload
 * Protected: Admin only
 * Expects form-data field: 'file' or 'image'
 */
router.post('/', authMiddleware, (req, res) => {
  const uploadHandler = upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]);

  uploadHandler(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Ukuran file terlalu besar. Maksimal 15MB.' });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    const file = (req.files && (req.files.file?.[0] || req.files.image?.[0])) || req.file;

    if (!file) {
      return res.status(400).json({ error: 'Tidak ada file gambar yang diunggah.' });
    }

    // 1. If running on Vercel or memory storage:
    if (isVercel || !file.filename) {
      // Option A: If user provided an ImgBB API key, upload to ImgBB CDN
      if (process.env.IMGBB_API_KEY) {
        try {
          const imgbbFormData = new FormData();
          const blob = new Blob([file.buffer], { type: file.mimetype });
          imgbbFormData.append('image', blob, file.originalname);

          const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
            method: 'POST',
            body: imgbbFormData,
          });
          const imgbbJson = await imgbbRes.json();
          if (imgbbJson.success) {
            return res.json({
              success: true,
              filename: file.originalname,
              url: imgbbJson.data.display_url || imgbbJson.data.url,
              size: file.size,
              mimetype: file.mimetype,
            });
          }
        } catch (imgbbErr) {
          console.error('ImgBB upload fallback to Base64:', imgbbErr);
        }
      }

      // Option B: Store as base64 Data URL (0 config needed, works directly in MongoDB Atlas!)
      const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      return res.json({
        success: true,
        filename: file.originalname,
        url: base64,
        size: file.size,
        mimetype: file.mimetype,
      });
    }

    // 2. Local environment: Return static served URL
    const host = req.get('host');
    const protocol = req.protocol;
    const fileUrl = `${protocol}://${host}/uploads/${file.filename}`;

    res.json({
      success: true,
      filename: file.filename,
      originalName: file.originalname,
      url: fileUrl,
      relativePath: `/uploads/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
    });
  });
});

module.exports = router;
