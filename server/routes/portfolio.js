const express = require('express');
const crypto = require('crypto');
const Portfolio = require('../models/Portfolio');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ── Helper: Get or initialize the singleton portfolio doc ─────────────────────
async function getPortfolio() {
  let doc = await Portfolio.findOne({ _key: 'main' });
  if (!doc) {
    // Should not happen after seeding, but safety net
    throw new Error('Portfolio data not initialized. Run seed.js first.');
  }
  return doc;
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ROUTES (no auth required — visitors fetch portfolio data)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/portfolio
 * Returns the full portfolio data
 */
router.get('/', async (req, res) => {
  try {
    const doc = await getPortfolio();
    res.json({
      profile: doc.profile,
      stats: doc.stats,
      clients: doc.clients,
      milestones: doc.milestones,
      categories: doc.categories,
      photos: doc.photos.sort((a, b) => a.order - b.order),
    });
  } catch (err) {
    console.error('GET /portfolio error:', err);
    res.status(500).json({ error: 'Failed to fetch portfolio data' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PROTECTED ROUTES (JWT required — admin only)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * PUT /api/portfolio/profile
 * Update profile information
 */
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const doc = await getPortfolio();
    const allowed = ['name', 'tagline', 'shortBio', 'aboutLong', 'location', 'email', 'whatsapp', 'instagram', 'youtube', 'behance', 'photo', 'avatar', 'heroImage'];
    
    allowed.forEach(field => {
      if (req.body[field] !== undefined) {
        doc.profile[field] = req.body[field];
      }
    });

    doc.markModified('profile');
    await doc.save();
    res.json({ message: 'Profile updated', profile: doc.profile });
  } catch (err) {
    console.error('PUT /profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * PUT /api/portfolio/stats
 * Replace all stats
 * Body: { stats: [{ number, suffix, label }] }
 */
router.put('/stats', authMiddleware, async (req, res) => {
  try {
    const { stats } = req.body;
    if (!Array.isArray(stats)) {
      return res.status(400).json({ error: 'stats must be an array' });
    }

    const doc = await getPortfolio();
    doc.stats = stats;
    await doc.save();
    res.json({ message: 'Stats updated', stats: doc.stats });
  } catch (err) {
    console.error('PUT /stats error:', err);
    res.status(500).json({ error: 'Failed to update stats' });
  }
});

/**
 * PUT /api/portfolio/clients
 * Replace all clients
 * Body: { clients: [string] }
 */
router.put('/clients', authMiddleware, async (req, res) => {
  try {
    const { clients } = req.body;
    if (!Array.isArray(clients)) {
      return res.status(400).json({ error: 'clients must be an array' });
    }

    const doc = await getPortfolio();
    doc.clients = clients;
    await doc.save();
    res.json({ message: 'Clients updated', clients: doc.clients });
  } catch (err) {
    console.error('PUT /clients error:', err);
    res.status(500).json({ error: 'Failed to update clients' });
  }
});

/**
 * PUT /api/portfolio/milestones
 * Replace all milestones
 * Body: { milestones: [{ year, title, description }] }
 */
router.put('/milestones', authMiddleware, async (req, res) => {
  try {
    const { milestones } = req.body;
    if (!Array.isArray(milestones)) {
      return res.status(400).json({ error: 'milestones must be an array' });
    }

    const doc = await getPortfolio();
    doc.milestones = milestones;
    await doc.save();
    res.json({ message: 'Milestones updated', milestones: doc.milestones });
  } catch (err) {
    console.error('PUT /milestones error:', err);
    res.status(500).json({ error: 'Failed to update milestones' });
  }
});

/**
 * PUT /api/portfolio/categories
 * Replace all categories
 * Body: { categories: [{ id, name }] }
 */
router.put('/categories', authMiddleware, async (req, res) => {
  try {
    const { categories } = req.body;
    if (!Array.isArray(categories)) {
      return res.status(400).json({ error: 'categories must be an array' });
    }

    const doc = await getPortfolio();
    doc.categories = categories;
    await doc.save();
    res.json({ message: 'Categories updated', categories: doc.categories });
  } catch (err) {
    console.error('PUT /categories error:', err);
    res.status(500).json({ error: 'Failed to update categories' });
  }
});

// ── Photos CRUD ───────────────────────────────────────────────────────────────

/**
 * POST /api/portfolio/photos
 * Add a new photo
 */
router.post('/photos', authMiddleware, async (req, res) => {
  try {
    const { title, category, categoryLabel, year, client, aspect, image, thumb, description } = req.body;

    if (!title || !category || !image) {
      return res.status(400).json({ error: 'title, category, and image are required' });
    }

    const doc = await getPortfolio();
    const newPhoto = {
      id: `photo_${crypto.randomBytes(4).toString('hex')}`,
      title,
      category,
      categoryLabel: categoryLabel || category,
      year: year || new Date().getFullYear().toString(),
      client: client || '',
      aspect: aspect || 'landscape',
      image,
      thumb: thumb || image,
      description: description || '',
      order: doc.photos.length,
    };

    doc.photos.push(newPhoto);
    await doc.save();
    res.status(201).json({ message: 'Photo added', photo: newPhoto });
  } catch (err) {
    console.error('POST /photos error:', err);
    res.status(500).json({ error: 'Failed to add photo' });
  }
});

/**
 * PUT /api/portfolio/photos/reorder/batch
 * Reorder photos
 * Body: { order: ['id1', 'id2', ...] }
 */
router.put('/photos/reorder/batch', authMiddleware, async (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) {
      return res.status(400).json({ error: 'order must be an array of photo IDs' });
    }

    const doc = await getPortfolio();
    order.forEach((id, index) => {
      const photo = doc.photos.find(p => p.id === id);
      if (photo) photo.order = index;
    });

    doc.markModified('photos');
    await doc.save();
    res.json({ message: 'Photos reordered' });
  } catch (err) {
    console.error('PUT /photos/reorder error:', err);
    res.status(500).json({ error: 'Failed to reorder photos' });
  }
});

/**
 * PUT /api/portfolio/photos/:id
 * Update a specific photo
 */
router.put('/photos/:id', authMiddleware, async (req, res) => {
  try {
    const doc = await getPortfolio();
    const photoIndex = doc.photos.findIndex(p => p.id === req.params.id);

    if (photoIndex === -1) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    const allowed = ['title', 'category', 'categoryLabel', 'year', 'client', 'aspect', 'image', 'thumb', 'description', 'order'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) {
        doc.photos[photoIndex][field] = req.body[field];
      }
    });

    doc.markModified('photos');
    await doc.save();
    res.json({ message: 'Photo updated', photo: doc.photos[photoIndex] });
  } catch (err) {
    console.error('PUT /photos/:id error:', err);
    res.status(500).json({ error: 'Failed to update photo' });
  }
});

/**
 * DELETE /api/portfolio/photos/:id
 * Delete a specific photo
 */
router.delete('/photos/:id', authMiddleware, async (req, res) => {
  try {
    const doc = await getPortfolio();
    const before = doc.photos.length;
    doc.photos = doc.photos.filter(p => p.id !== req.params.id);

    if (doc.photos.length === before) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    doc.markModified('photos');
    await doc.save();
    res.json({ message: 'Photo deleted' });
  } catch (err) {
    console.error('DELETE /photos/:id error:', err);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

module.exports = router;
