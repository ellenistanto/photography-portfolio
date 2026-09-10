const jwt = require('jsonwebtoken');

/**
 * Middleware: Verify JWT token from Authorization header
 * Usage: router.put('/route', authMiddleware, handler)
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized — token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired — please login again' });
    }
    return res.status(401).json({ error: 'Unauthorized — invalid token' });
  }
}

module.exports = authMiddleware;
