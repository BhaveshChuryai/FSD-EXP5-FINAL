import { z } from 'zod'

export const createPartnerSchema = z.object({
  partnerType: z.string({ required_error: 'Partner type is required' }).trim().min(2, 'Partner type must be at least 2 characters'),
  name: z.string({ required_error: 'Full name or company name is required' }).trim().min(2, 'Name must be at least 2 characters').max(120),
  phone: z.string({ required_error: 'Contact phone number is required' }).trim().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number'),
  email: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
  location: z.string().trim().min(2).optional().default('Maharashtra'),
  docStatus: z.string().trim().max(100).optional().default('7/12 Available'),
  reraNumber: z.string().trim().max(50).optional(),
  experience: z.string().trim().max(100).optional(),
  notes: z.string().trim().max(1000).optional(),
  consent: z.boolean().optional(),
})

export const updatePartnerStatusSchema = z.object({
  status: z.enum(['Pending Review', 'Under Verification', 'Approved', 'Rejected'], {
    required_error: 'Valid partner application status is required',
  }),
}).strict()
