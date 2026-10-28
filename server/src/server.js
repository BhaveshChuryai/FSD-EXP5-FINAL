import dotenv from 'dotenv'
dotenv.config()

import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import app from './app.js'
import { connectDB, disconnectDB } from './config/db.js'
import { setupChatSocket } from './sockets/chatSocket.js'

const PORT = process.env.PORT || 5000

async function bootstrap() {
  try {
    // 1. Validate mandatory security configurations
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim().length < 32) {
      console.error('❌ Security Configuration Error: JWT_SECRET environment variable is missing or less than 32 characters.')
      throw new Error('Security configuration error: JWT_SECRET must be at least 32 characters long.')
    }

    // 2. Establish database connection before accepting traffic
    await connectDB()

    // 3. Create HTTP server and initialize Socket.IO
    const httpServer = http.createServer(app)

    const clientOriginEnv = process.env.CLIENT_ORIGIN || process.env.CLIENT_URL || 'http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://localhost:80,http://127.0.0.1:80,http://localhost'
    const allowedOrigins = clientOriginEnv
      .split(',')
      .map(origin => origin.trim())
      .filter(Boolean)

    const isLocalOrigin = (origin) => /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
    const isVercelOrigin = (origin) => /^https:\/\/[a-z0-9-]+(\.vercel\.app|\.onrender\.com)$/.test(origin)

    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: (origin, callback) => {
          if (
            !origin ||
            allowedOrigins.includes(origin) ||
            (process.env.NODE_ENV !== 'production' && isLocalOrigin(origin)) ||
            (process.env.ALLOW_VERCEL_PREVIEWS === 'true' && isVercelOrigin(origin))
          ) {
            return callback(null, true)
          }
          return callback(new Error('CORS origin rejected by server policy'), false)
        },
        credentials: true,
        methods: ['GET', 'POST'],
      },
      pingTimeout: 30000,
      pingInterval: 25000,
    })

    // Mount Socket.IO real-time community chat handlers
    setupChatSocket(io)

    // Make io accessible to controllers via app.locals for admin notifications
    app.locals.io = io

    // 4. Start combined HTTP & WebSocket server
    const server = httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Plottage Hub API server running at: http://localhost:${PORT}`)
      console.log(`💬 Socket.IO Real-Time Chat server active at ws://localhost:${PORT}`)
      console.log(`🛡️  Security controls active: Helmet, Strict CORS, Rate Limiter, Zod Validation, Bcrypt, JWT`)
      console.log(`🌐 Ready to serve FSD Experiments 4, 5, 6, 7 & 8`)
    })

    // 3. Graceful shutdown handler
    const handleShutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`)
      server.close(async () => {
        console.log('HTTP server closed.')
        await disconnectDB()
        process.exit(0)
      })

      // Force shutdown after timeout if hanging
      setTimeout(() => {
        console.error('⚠️ Forcefully terminating after shutdown timeout.')
        process.exit(1)
      }, 10000)
    }

    process.on('SIGINT', () => handleShutdown('SIGINT'))
    process.on('SIGTERM', () => handleShutdown('SIGTERM'))
  } catch (error) {
    console.error('❌ Failed to start application server:', error.message)
    process.exit(1)
  }
}

// Global safety net: prevent crashes from unhandled async rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Promise Rejection at:', promise, 'reason:', reason)
  // Don't crash the server on unhandled rejections — log and continue
})

// Global safety net: catch synchronous errors that escaped try/catch
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message, err.stack)
  process.exit(1)
})

bootstrap()
