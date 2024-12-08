import rateLimit from 'express-rate-limit';

export const createRateLimiter = (options = {}) => {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    // Custom key generator that handles missing IP addresses
    keyGenerator: (req) => {
      return req.ip || req.headers['x-forwarded-for'] || 'unknown-ip';
    },
    skip: (req) => {
      // Skip rate limiting in development environment
      return process.env.NODE_ENV === 'development';
    },
    ...options
  });
};