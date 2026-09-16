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
    // Cache di Vercel CDN Edge selama 60 detik, revalidasi di background
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.json({
      profile: doc.profile,
      stats: doc.stats,
      clients: doc.clients,
      milestones: doc.milestones,
      categories: doc.categories,
      photos: doc.photos.sort((a, b) => a.order - b.order),
      projects: (doc.projects || []).sort((a, b) => (a.order || 0) - (b.order || 0)),
      overview: doc.overview || {
        enabled: true,
        title: 'Selected Works',
        subtitle: 'Curated highlights & moments in between',
        photoIds: [],
      },
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

// ── Overview Configuration ───────────────────────────────────────────────────

/**
 * PUT /api/portfolio/overview
 * Update overview configuration & curated photo list
 * Body: { enabled?: boolean, title?: string, subtitle?: string, photoIds?: string[] }
 */
router.put('/overview', authMiddleware, async (req, res) => {
  try {
    const doc = await getPortfolio();
    if (!doc.overview) {
      doc.overview = {
        enabled: true,
        title: 'Selected Works',
        subtitle: 'Curated highlights & moments in between',
        photoIds: [],
      };
    }

    const { enabled, title, subtitle, photoIds } = req.body;
    if (enabled !== undefined) doc.overview.enabled = Boolean(enabled);
    if (title !== undefined) doc.overview.title = String(title);
    if (subtitle !== undefined) doc.overview.subtitle = String(subtitle);

    if (Array.isArray(photoIds)) {
      doc.overview.photoIds = photoIds;
      const idSet = new Set(photoIds);
      doc.photos.forEach(p => {
        p.isOverview = idSet.has(p.id);
      });
      doc.markModified('photos');
    }

    doc.markModified('overview');
    await doc.save();
    res.json({
      message: 'Overview updated successfully',
      overview: doc.overview,
      photos: doc.photos.sort((a, b) => a.order - b.order),
    });
  } catch (err) {
    console.error('PUT /overview error:', err);
    res.status(500).json({ error: 'Failed to update overview' });
  }
});

// ── Photos CRUD ───────────────────────────────────────────────────────────────

/**
 * POST /api/portfolio/photos
 * Add a new photo
 */
router.post('/photos', authMiddleware, async (req, res) => {
  try {
    const { title, category, categoryLabel, year, client, aspect, image, thumb, description, isOverview } = req.body;

    if (!title || !category || !image) {
      return res.status(400).json({ error: 'title, category, and image are required' });
    }

    const doc = await getPortfolio();
    const photoId = `photo_${crypto.randomBytes(4).toString('hex')}`;
    const newPhoto = {
      id: photoId,
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
      isOverview: Boolean(isOverview),
    };

    doc.photos.push(newPhoto);

    if (newPhoto.isOverview) {
      if (!doc.overview) {
        doc.overview = { enabled: true, title: 'Selected Works', subtitle: 'Curated highlights & moments in between', photoIds: [] };
      }
      if (!doc.overview.photoIds.includes(photoId)) {
        doc.overview.photoIds.push(photoId);
        doc.markModified('overview');
      }
    }

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

    const allowed = ['title', 'category', 'categoryLabel', 'year', 'client', 'aspect', 'image', 'thumb', 'description', 'order', 'isOverview'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) {
        doc.photos[photoIndex][field] = req.body[field];
      }
    });

    if (req.body.isOverview !== undefined) {
      if (!doc.overview) {
        doc.overview = { enabled: true, title: 'Selected Works', subtitle: 'Curated highlights & moments in between', photoIds: [] };
      }
      const pId = req.params.id;
      if (req.body.isOverview) {
        if (!doc.overview.photoIds.includes(pId)) {
          doc.overview.photoIds.push(pId);
        }
      } else {
        doc.overview.photoIds = doc.overview.photoIds.filter(id => id !== pId);
      }
      doc.markModified('overview');
    }

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

    if (doc.overview && Array.isArray(doc.overview.photoIds)) {
      doc.overview.photoIds = doc.overview.photoIds.filter(id => id !== req.params.id);
      doc.markModified('overview');
    }

    doc.markModified('photos');
    await doc.save();
    res.json({ message: 'Photo deleted' });
  } catch (err) {
    console.error('DELETE /photos/:id error:', err);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

// ── Projects Public & CRUD ───────────────────────────────────────────────────

/**
 * Helper to slugify a title
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * GET /api/portfolio/projects/:slug
 * Get a specific project by slug or ID (public)
 */
router.get('/projects/:slug', async (req, res) => {
  try {
    const doc = await getPortfolio();
    const project = (doc.projects || []).find(
      p => p.slug === req.params.slug || p.id === req.params.slug
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    console.error('GET /projects/:slug error:', err);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

/**
 * POST /api/portfolio/projects
 * Create a new project (admin only)
 */
router.post('/projects', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      categoryLabel,
      client,
      year,
      location,
      coverImage,
      summary,
      description,
      photos = [],
      isFeatured = true,
    } = req.body;

    if (!title || !coverImage) {
      return res.status(400).json({ error: 'title and coverImage are required' });
    }

    const doc = await getPortfolio();
    if (!doc.projects) doc.projects = [];

    const projectId = `proj_${crypto.randomBytes(4).toString('hex')}`;
    let finalSlug = slug ? slugify(slug) : slugify(title);

    // Ensure slug uniqueness
    const slugExists = doc.projects.some(p => p.slug === finalSlug);
    if (slugExists) {
      finalSlug = `${finalSlug}-${crypto.randomBytes(2).toString('hex')}`;
    }

    // Format photos in project with ids
    const formattedPhotos = (photos || []).map((photo, idx) => ({
      id: photo.id || `pp_${crypto.randomBytes(3).toString('hex')}`,
      title: photo.title || '',
      caption: photo.caption || '',
      aspect: photo.aspect || 'landscape',
      image: photo.image,
      thumb: photo.thumb || photo.image,
      order: photo.order !== undefined ? photo.order : idx,
    }));

    const newProject = {
      id: projectId,
      slug: finalSlug,
      title,
      category: category || 'commercial',
      categoryLabel: categoryLabel || 'Commercial',
      client: client || '',
      year: year || new Date().getFullYear().toString(),
      location: location || '',
      coverImage,
      summary: summary || '',
      description: description || '',
      photos: formattedPhotos,
      isFeatured: Boolean(isFeatured),
      order: doc.projects.length,
    };

    doc.projects.push(newProject);
    doc.markModified('projects');
    await doc.save();

    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (err) {
    console.error('POST /projects error:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

/**
 * PUT /api/portfolio/projects/reorder/batch
 * Reorder projects (admin only)
 */
router.put('/projects/reorder/batch', authMiddleware, async (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) {
      return res.status(400).json({ error: 'order must be an array of project IDs' });
    }

    const doc = await getPortfolio();
    if (!doc.projects) doc.projects = [];

    order.forEach((id, index) => {
      const proj = doc.projects.find(p => p.id === id);
      if (proj) proj.order = index;
    });

    doc.markModified('projects');
    await doc.save();
    res.json({ message: 'Projects reordered successfully' });
  } catch (err) {
    console.error('PUT /projects/reorder error:', err);
    res.status(500).json({ error: 'Failed to reorder projects' });
  }
});

/**
 * PUT /api/portfolio/projects/:id
 * Update an existing project (admin only)
 */
router.put('/projects/:id', authMiddleware, async (req, res) => {
  try {
    const doc = await getPortfolio();
    if (!doc.projects) doc.projects = [];

    const index = doc.projects.findIndex(
      p => p.id === req.params.id || p.slug === req.params.id
    );

    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const current = doc.projects[index];
    const allowed = [
      'title',
      'slug',
      'category',
      'categoryLabel',
      'client',
      'year',
      'location',
      'coverImage',
      'summary',
      'description',
      'isFeatured',
      'order',
    ];

    allowed.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'slug') {
          current[field] = slugify(req.body[field]);
        } else {
          current[field] = req.body[field];
        }
      }
    });

    // Handle photos update if provided
    if (Array.isArray(req.body.photos)) {
      current.photos = req.body.photos.map((photo, idx) => ({
        id: photo.id || `pp_${crypto.randomBytes(3).toString('hex')}`,
        title: photo.title || '',
        caption: photo.caption || '',
        aspect: photo.aspect || 'landscape',
        image: photo.image,
        thumb: photo.thumb || photo.image,
        order: photo.order !== undefined ? photo.order : idx,
      }));
    }

    doc.markModified('projects');
    await doc.save();

    res.json({ message: 'Project updated successfully', project: current });
  } catch (err) {
    console.error('PUT /projects/:id error:', err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

/**
 * DELETE /api/portfolio/projects/:id
 * Delete a project (admin only)
 */
router.delete('/projects/:id', authMiddleware, async (req, res) => {
  try {
    const doc = await getPortfolio();
    if (!doc.projects) doc.projects = [];

    const beforeCount = doc.projects.length;
    doc.projects = doc.projects.filter(
      p => p.id !== req.params.id && p.slug !== req.params.id
    );

    if (doc.projects.length === beforeCount) {
      return res.status(404).json({ error: 'Project not found' });
    }

    doc.markModified('projects');
    await doc.save();

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('DELETE /projects/:id error:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;
