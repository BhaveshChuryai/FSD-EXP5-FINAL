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

// 1. HTTP Security Headers with Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

// 2. Strict CORS Configuration
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173')
  .split(',')
  .map(origin => origin.trim())

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server or tools without origin (Postman/curl) in development
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error(`CORS policy blocked access from origin: ${origin}`))
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
