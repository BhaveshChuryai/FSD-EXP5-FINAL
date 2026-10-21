import { z } from 'zod'

export const createLeadSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).trim().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string({ required_error: 'Phone number is required' }).trim().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number'),
  email: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
  propertyType: z.string({ required_error: 'Property type is required' }).min(2, 'Property type is required'),
  location: z.string({ required_error: 'Location is required' }).min(2, 'Location is required'),
  minBudget: z.coerce.number().nonnegative().optional().default(0),
  maxBudget: z.coerce.number().nonnegative().optional().default(0),
  area: z.union([z.string(), z.number()]).optional(),
  areaUnit: z.string().optional().default('Acre'),
  purpose: z.string().optional().default('Investment'),
  timeline: z.string().optional().default('Exploring / No fixed timeline'),
  requirements: z.string().max(1000).optional().default(''),
  propertyId: z.string().optional(),
  propertyTitle: z.string().optional(),
  preferredDate: z.string().optional(),
  consent: z.boolean().optional(),
})

export const updateLeadStatusSchema = z.object({
  status: z.enum(['New', 'Contacted', 'Visit Scheduled', 'Closed'], {
    required_error: 'Valid status is required',
  }),
})
