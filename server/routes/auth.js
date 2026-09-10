const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiter — max 5 login attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Store hashed admin password (cached in memory)
let hashedAdminPassword = null;

async function getHashedAdminPassword() {
  if (!hashedAdminPassword) {
    const adminPass = process.env.ADMIN_PASSWORD;
    if (!adminPass) {
      console.warn('⚠️ ADMIN_PASSWORD is not set in environment variables! Using fallback.');
    }
    hashedAdminPassword = await bcrypt.hash(adminPass || 'admin123', 12);
  }
  return hashedAdminPassword;
}

// Pre-warm hash if env is available
if (process.env.ADMIN_PASSWORD) {
  getHashedAdminPassword().catch(console.error);
}

/**
 * POST /api/auth/login
 * Body: { password: string }
 * Returns: { token: string, expiresIn: string }
 */
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const expectedHash = await getHashedAdminPassword();
    const isValid = await bcrypt.compare(password, expectedHash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET || 'secret-fallback-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      expiresIn: '7d',
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * POST /api/auth/verify
 * Verify if current token is still valid
 */
router.post('/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }

  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true });
  } catch {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
