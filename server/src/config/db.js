import mongoose from 'mongoose'
import dns from 'dns'

let isConnected = false

export async function connectDB() {
  if (isConnected) {
    return mongoose.connection
  }

  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error('❌ Database Configuration Error: MONGODB_URI environment variable is missing.')
    throw new Error('Database configuration missing: MONGODB_URI is required.')
  }

  // Ensure Node.js DNS resolver on Windows can resolve Atlas SRV records reliably if connecting to Atlas
  if (uri.startsWith('mongodb+srv://')) {
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1'])
    } catch {
      // Ignore if DNS server configuration cannot be overridden
    }
  }

  try {
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }

    const conn = await mongoose.connect(uri, options)
    isConnected = true

    // Mask sensitive details (username/password) when logging connection host
    const sanitizedHost = conn.connection.host || 'MongoDB Cluster'
    console.log(`✅ MongoDB Connected successfully to host: ${sanitizedHost} [db: ${conn.connection.name}]`)

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB runtime error:', err.message)
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB connection lost. Attempting reconnection...')
      isConnected = false
    })

    return conn
  } catch (error) {
    console.error('❌ Failed to establish initial MongoDB connection:', error.message)
    throw error
  }
}

export async function disconnectDB() {
  if (!isConnected) return
  try {
    await mongoose.connection.close()
    isConnected = false
    console.log('🔌 MongoDB connection closed gracefully.')
  } catch (err) {
    console.error('❌ Error during MongoDB disconnection:', err.message)
  }
}
