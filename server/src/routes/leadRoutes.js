import { Router } from 'express'
import {
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus,
} from '../controllers/leadController.js'
import { validateRequest, validateObjectId } from '../middleware/validateRequest.js'
import { createLeadSchema, updateLeadStatusSchema } from '../validators/leadValidator.js'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'
import { submissionLimiter } from '../middleware/rateLimiter.js'

const router = Router()

// Public: Submit buyer requirement enquiry
router.post(
  '/',
  submissionLimiter,
  validateRequest(createLeadSchema, 'body'),
  createLead
)

// Admin: Retrieve all leads
router.get(
  '/',
  authenticate,
  authorize('Admin'),
  getLeads
)

// Admin: Retrieve single lead by ID
router.get(
  '/:id',
  authenticate,
  authorize('Admin'),
  validateObjectId('id'),
  getLeadById
)

// Admin: Update lead status
router.patch(
  '/:id',
  authenticate,
  authorize('Admin'),
  validateObjectId('id'),
  validateRequest(updateLeadStatusSchema, 'body'),
  updateLeadStatus
)

export default router
