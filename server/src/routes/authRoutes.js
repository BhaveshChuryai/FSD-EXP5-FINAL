import { Router } from 'express'
import { register, login, getMe, logout } from '../controllers/authController.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { registerSchema, loginSchema } from '../validators/authValidator.js'
import { authenticate } from '../middleware/authenticate.js'
import { authLimiter } from '../middleware/rateLimiter.js'

const router = Router()

// Public: Register new account
router.post(
  '/register',
  authLimiter,
  validateRequest(registerSchema, 'body'),
  register
)

// Public: Sign in to account
router.post(
  '/login',
  authLimiter,
  validateRequest(loginSchema, 'body'),
  login
)

// Authenticated: Get current user profile
router.get(
  '/me',
  authenticate,
  getMe
)

// Authenticated / Public: Logout and invalidate session
router.post(
  '/logout',
  logout
)

export default router
