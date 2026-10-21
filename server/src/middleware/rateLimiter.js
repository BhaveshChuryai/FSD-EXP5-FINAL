import rateLimit from 'express-rate-limit'

// Limit for sensitive authentication operations (login / register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
})

// Limit for public lead and listing form submissions to prevent spam
export const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 submissions per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Submission rate limit reached. Please wait a few minutes before submitting another enquiry or listing.',
  },
})

// General API protection limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per 15 mins for browsing properties
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'API rate limit exceeded. Please try again later.',
  },
})
