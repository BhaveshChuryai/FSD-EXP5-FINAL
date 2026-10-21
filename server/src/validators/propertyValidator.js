import { z } from 'zod'

export const createPropertySchema = z.object({
  title: z.string({ required_error: 'Property title is required' }).trim().min(3, 'Title must be at least 3 characters').max(160),
  description: z.string().max(3000).optional().default(''),
  location: z.string({ required_error: 'Location is required' }).trim().min(2),
  detailedAddress: z.string().max(300).optional().default(''),
  propertyType: z.string({ required_error: 'Property type is required' }).min(2),
  area: z.coerce.number({ required_error: 'Valid area number is required' }).positive('Area must be greater than zero'),
  areaUnit: z.enum(['Sq.ft', 'Sq.m', 'Guntha', 'Acre', 'Acres', 'Hectare']).default('Acre'),
  price: z.string({ required_error: 'Price is required' }).trim().min(1),
  priceAmount: z.coerce.number().nonnegative().optional().default(0),
  priceFlexibility: z.string().optional().default('Negotiable based on payment terms'),
  infrastructure: z.union([z.array(z.string()), z.string()]).optional().default([]),
  docStatus: z.string().optional().default('7/12 Extract Available'),
  ownership: z.string().optional().default('Sole Landowner'),
  images: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  // User/Landowner contact details (from listing form)
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  consent: z.boolean().optional(),
})

export const updatePropertySchema = z.object({
  title: z.string().trim().min(3).max(160).optional(),
  description: z.string().max(3000).optional(),
  location: z.string().trim().min(2).optional(),
  detailedAddress: z.string().max(300).optional(),
  propertyType: z.string().min(2).optional(),
  area: z.coerce.number().positive().optional(),
  areaUnit: z.enum(['Sq.ft', 'Sq.m', 'Guntha', 'Acre', 'Acres', 'Hectare']).optional(),
  price: z.string().trim().min(1).optional(),
  priceAmount: z.coerce.number().nonnegative().optional(),
  priceFlexibility: z.string().optional(),
  infrastructure: z.union([z.array(z.string()), z.string()]).optional(),
  docStatus: z.string().optional(),
  ownership: z.string().optional(),
  images: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  status: z.enum(['Pending Review', 'Approved', 'Published', 'Rejected']).optional(),
}).strict()

export const propertyQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(10),
  search: z.string().trim().optional(),
  location: z.string().trim().optional(),
  type: z.string().trim().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  minArea: z.coerce.number().nonnegative().optional(),
  maxArea: z.coerce.number().nonnegative().optional(),
  sort: z.enum(['newest', 'price-asc', 'price-desc', 'area-asc', 'area-desc']).optional().default('newest'),
})
