// JWT-based authentication middleware
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Token cache for improved performance
const tokenCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_CLEANUP_INTERVAL = 60 * 1000; // Clean up every minute

// Periodic cache cleanup to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [token, entry] of tokenCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      tokenCache.delete(token);
    }
  }
}, CACHE_CLEANUP_INTERVAL);

// Reusable error objects for better performance
const ERRORS = Object.freeze({
  NO_TOKEN: Object.freeze({ success: false, error: 'Access token required' }),
  INVALID_TOKEN: Object.freeze({ success: false, error: 'Invalid or expired token' }),
  INVALID_ID: Object.freeze({ success: false, error: 'Invalid ID parameter' })
});

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json(ERRORS.NO_TOKEN);
  }

  // Check cache first
  const cached = tokenCache.get(token);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    req.user = cached.user;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = {
      userId: decoded.userId,
      email: decoded.email
    };

    // Cache the result
    tokenCache.set(token, {
      user,
      timestamp: Date.now()
    });

    req.user = user;
    next();
  } catch (error) {
    // Remove invalid token from cache if present
    tokenCache.delete(token);
    return res.status(403).json(ERRORS.INVALID_TOKEN);
  }
};

export const validateId = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json(ERRORS.INVALID_ID);
  }
  next();
};
