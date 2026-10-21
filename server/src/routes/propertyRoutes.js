import { Router } from 'express'
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getAllListingsAdmin,
} from '../controllers/propertyController.js'
import { validateRequest, validateObjectId } from '../middleware/validateRequest.js'
import {
  createPropertySchema,
  updatePropertySchema,
  propertyQuerySchema,
} from '../validators/propertyValidator.js'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'
import { submissionLimiter, apiLimiter } from '../middleware/rateLimiter.js'

const router = Router()

// Public: Get published properties with filters, search & pagination
router.get(
  '/',
  apiLimiter,
  validateRequest(propertyQuerySchema, 'query'),
  getProperties
)

// Admin: Get all submitted listings (including pending review)
router.get(
  '/admin/all',
  authenticate,
  authorize('Admin'),
  getAllListingsAdmin
)

// Public: Get single property by ID or slug
router.get('/:id', getPropertyById)

// Public/Owner: Submit a property for listing (defaults to 'Pending Review')
router.post(
  '/',
  submissionLimiter,
  validateRequest(createPropertySchema, 'body'),
  createProperty
)

// Admin: Update property fields or publish/reject
router.patch(
  '/:id',
  authenticate,
  authorize('Admin'),
  validateObjectId('id'),
  validateRequest(updatePropertySchema, 'body'),
  updateProperty
)

// Admin: Delete a property
router.delete(
  '/:id',
  authenticate,
  authorize('Admin'),
  validateObjectId('id'),
  deleteProperty
)

export default router
