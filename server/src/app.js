import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'

// Routes
import propertyRoutes from './routes/propertyRoutes.js'
import leadRoutes from './routes/leadRoutes.js'
import authRoutes from './routes/authRoutes.js'
import partnerRoutes from './routes/partnerRoutes.js'

// Middlewares
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { createProperty, getAllListingsAdmin } from './controllers/propertyController.js'
import { getAdminDashboard } from './controllers/authController.js'
import { authenticate } from './middleware/authenticate.js'
import { authorize } from './middleware/authorize.js'
import { validateRequest } from './middleware/validateRequest.js'
import { createPropertySchema } from './validators/propertyValidator.js'
import { submissionLimiter } from './middleware/rateLimiter.js'

const app = express()

// 1. Trust Proxy Configuration (Crucial for Docker Compose Nginx reverse-proxy & Render Cloudflare/Envoy proxy)
// Trusting 1 upstream proxy hop ensures express-rate-limit correctly resolves client IP
// without throwing ERR_ERL_UNEXPECTED_X_FORWARDED_FOR and avoids trusting arbitrary client-spoofed headers.
const rawTrustProxy = process.env.TRUST_PROXY
if (rawTrustProxy !== undefined) {
  const parsed = Number(rawTrustProxy)
  app.set('trust proxy', Number.isInteger(parsed) ? parsed : rawTrustProxy === 'true' ? true : rawTrustProxy === 'false' ? false : rawTrustProxy)
} else if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1)
} else {
  // In development and test modes, trust 1 hop if behind reverse proxy / Vite proxy
  app.set('trust proxy', 1)
}

// 2. HTTP Security Headers with Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

// 3. Strict CORS Configuration
const clientOriginEnv = process.env.CLIENT_ORIGIN || process.env.CLIENT_URL || 'http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://localhost:80,http://127.0.0.1:80,http://localhost'
const allowedOrigins = clientOriginEnv
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean)

const isLocalOrigin = (origin) => /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
const isVercelOrigin = (origin) => /^https:\/\/[a-z0-9-]+(\.vercel\.app|\.onrender\.com)$/.test(origin)

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server, curl, health checks, or mobile tools without Origin header
    if (!origin) {
      return callback(null, true)
    }
    if (
      allowedOrigins.includes(origin) ||
      (process.env.NODE_ENV !== 'production' && isLocalOrigin(origin)) ||
      (process.env.ALLOW_VERCEL_PREVIEWS === 'true' && isVercelOrigin(origin))
    ) {
      return callback(null, true)
    }
    // Controlled rejection: return false rather than throwing an exception
    return callback(null, false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}))

// 3. Body parsers with request size limits to guard against DoS
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// 4. API Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState
  const isReady = dbState === 1
  const dbStatus = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'][dbState] || 'Unknown'

  res.status(isReady ? 200 : 503).json({
    success: isReady,
    service: 'Plottage Hub API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      connected: isReady,
    },
    experiments: [
      'FSD Exp 4 (REST API + MongoDB + Mongoose)',
      'FSD Exp 5 (Secure REST APIs)',
      'FSD Exp 6 (JWT Authentication & RBAC)',
      'FSD Exp 7 (Dockerization & Docker Compose)',
      'FSD Exp 8 (Real-Time Communication with WebSockets / Socket.IO)',
    ],
  })
})

// 5. Mount Core Domain API Routes
app.use('/api/properties', propertyRoutes)
app.use('/api/leads', leadRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/partner-applications', partnerRoutes)

// Administrator Operational Metrics & Dashboard (Admin RBAC Protected)
app.get('/api/admin/dashboard', authenticate, authorize('admin', 'Admin'), getAdminDashboard)

// 6. Direct Aliases for complete seamless backwards compatibility with existing UI components
// POST /api/enquiries -> lead submission
app.use('/api/enquiries', leadRoutes)

// POST /api/listings and GET /api/listings -> map to property controller
app.post(
  '/api/listings',
  submissionLimiter,
  validateRequest(createPropertySchema, 'body'),
  createProperty
)
app.get('/api/listings', authenticate, authorize('Admin'), getAllListingsAdmin)

// 7. Undefined Route Handler
app.use(notFoundHandler)

// 8. Centralized Global Error Handler
app.use(errorHandler)

export default app
