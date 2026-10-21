import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string({ required_error: 'Full name is required' }).trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string({ required_error: 'Email is required' }).trim().email('Valid email is required').toLowerCase(),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number').optional().or(z.literal('')),
  password: z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters'),
  role: z.enum([
    'user',
    'Customer',
    'Customer / Buyer',
    'Landowner',
    'Broker',
    'Developer',
    'Investor',
  ]).optional().default('user'),
})

export const loginSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).trim().email('Valid email is required').toLowerCase(),
  password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
})
