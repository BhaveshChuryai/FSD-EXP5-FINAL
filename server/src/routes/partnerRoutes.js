import { Router } from 'express'
import {
  createApplication,
  getApplications,
  updateApplicationStatus,
} from '../controllers/partnerController.js'
import { submissionLimiter } from '../middleware/rateLimiter.js'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'
import { validateRequest, validateObjectId } from '../middleware/validateRequest.js'
import {
  createPartnerSchema,
  updatePartnerStatusSchema,
} from '../validators/partnerValidator.js'

const router = Router()

// Public: Submit partner application (rate limited and validated)
router.post(
  '/',
  submissionLimiter,
  validateRequest(createPartnerSchema, 'body'),
  createApplication
)

// Protected (Admin only): Get all partner applications
router.get(
  '/',
  authenticate,
  authorize('Admin'),
  getApplications
)

// Protected (Admin only): Update partner application status
router.patch(
  '/:id',
  authenticate,
  authorize('Admin'),
  validateObjectId('id'),
  validateRequest(updatePartnerStatusSchema, 'body'),
  updateApplicationStatus
)

export default router
