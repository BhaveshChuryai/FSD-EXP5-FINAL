import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Property from '../models/Property.js'
import Lead from '../models/Lead.js'
import PartnerApplication from '../models/PartnerApplication.js'

const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not configured on the server.')
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h'
  return jwt.sign({ id: userId, role }, secret, { expiresIn })
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000,
}

/**
 * POST /api/auth/register
 * Secure registration endpoint with bcrypt hashing and JWT issuance.
 * Strictly prevents role escalation to Admin.
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body
    const normalizedEmail = email.trim().toLowerCase()

    // 1. Check for duplicate account
    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in.',
      })
    }

    // 2. Prevent privilege escalation: public registration can NEVER create an admin
    const safeRole = role && !role.toLowerCase().includes('admin')
      ? role
      : 'user'

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : '',
      password, // Password hashed by User pre-save hook
      role: safeRole,
    })

    await user.save()

    const token = generateToken(user._id, user.role)

    // Set HttpOnly cookie for browser sessions
    res.cookie('ph_token', token, COOKIE_OPTIONS)

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      message: 'Account registered successfully.',
    })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/auth/login
 * Secure login verifying bcrypt password hash and returning signed JWT + HttpOnly cookie.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const normalizedEmail = email ? email.trim().toLowerCase() : ''

    // Explicitly query password since it has select: false on schema
    const user = await User.findOne({ email: normalizedEmail }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
      })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
      })
    }

    const token = generateToken(user._id, user.role)

    // Set HttpOnly cookie for browser sessions
    res.cookie('ph_token', token, COOKIE_OPTIONS)

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      message: 'Signed in successfully.',
    })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/auth/me
 * Protected: Returns details of the currently authenticated user.
 */
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id.toString(),
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/auth/logout
 * Clears session cookie and invalidates browser credentials.
 */
export const logout = async (req, res) => {
  res.clearCookie('ph_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  })
}

/**
 * GET /api/admin/dashboard
 * Administrator-only endpoint providing aggregated operational analytics.
 */
export const getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalProperties,
      pendingProperties,
      publishedProperties,
      totalLeads,
      newLeads,
      totalPartners,
      pendingPartners,
      totalUsers,
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: 'Pending Review' }),
      Property.countDocuments({ status: 'Published' }),
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'New' }),
      PartnerApplication.countDocuments(),
      PartnerApplication.countDocuments({ status: 'Pending Review' }),
      User.countDocuments(),
    ])

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalProperties,
          pendingProperties,
          publishedProperties,
          totalLeads,
          newLeads,
          totalPartners,
          pendingPartners,
          totalUsers,
        },
        systemStatus: 'Operational',
        databaseStatus: 'Connected',
        timestamp: new Date().toISOString(),
      },
    })
  } catch (err) {
    next(err)
  }
}
