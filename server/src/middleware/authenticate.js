import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const authenticate = async (req, res, next) => {
  try {
    let token = null
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]
    } else if (req.headers.cookie) {
      const match = req.headers.cookie.match(/(?:^|;\s*)ph_token=([^;]*)/)
      if (match) {
        token = decodeURIComponent(match[1])
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No bearer token provided.',
      })
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET is not configured on the server.')
    }
    const decoded = jwt.verify(token, secret)

    // Lookup user in DB to verify account still exists and fetch latest role
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed. User account not found or has been deactivated.',
      })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Authentication token has expired. Please sign in again.',
      })
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token.',
    })
  }
}
