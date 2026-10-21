import mongoose from 'mongoose'
import Property from '../models/Property.js'

/**
 * GET /api/properties
 * Public property discovery endpoint with search, filter, sort, and pagination.
 */
export const getProperties = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      location,
      type,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      sort = 'newest',
    } = req.query

    const pageNum = Math.max(1, parseInt(page, 10))
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)))
    const skip = (pageNum - 1) * limitNum

    // Build filter query: Public users only view 'Published' properties
    const query = {
      status: 'Published',
    }

    // Keyword search over title, location, description, and propertyType
    if (search && search.trim()) {
      const q = search.trim()
      // Safe regex construction
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(escaped, 'i')
      query.$or = [
        { title: regex },
        { location: regex },
        { description: regex },
        { propertyType: regex },
      ]
    }

    // Location filter
    if (location && location !== 'All' && location !== 'All Locations') {
      const escapedLoc = location.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      query.location = new RegExp(escapedLoc, 'i')
    }

    // Property Type filter
    if (type && type !== 'All') {
      query.propertyType = new RegExp(`^${type.trim()}$`, 'i')
    }

    // Price range filter (on priceAmount in Lakhs / numeric)
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.priceAmount = {}
      if (minPrice !== undefined && Number(minPrice) >= 0) query.priceAmount.$gte = Number(minPrice)
      if (maxPrice !== undefined && Number(maxPrice) > 0) query.priceAmount.$lte = Number(maxPrice)
      if (Object.keys(query.priceAmount).length === 0) delete query.priceAmount
    }

    // Area range filter (on acreEquivalent)
    if (minArea !== undefined || maxArea !== undefined) {
      query.acreEquivalent = {}
      if (minArea !== undefined && Number(minArea) >= 0) query.acreEquivalent.$gte = Number(minArea)
      if (maxArea !== undefined && Number(maxArea) > 0) query.acreEquivalent.$lte = Number(maxArea)
      if (Object.keys(query.acreEquivalent).length === 0) delete query.acreEquivalent
    }

    // Sorting strategy
    let sortOptions = { createdAt: -1 }
    if (sort === 'price-asc') sortOptions = { priceAmount: 1 }
    else if (sort === 'price-desc') sortOptions = { priceAmount: -1 }
    else if (sort === 'area-asc') sortOptions = { acreEquivalent: 1 }
    else if (sort === 'area-desc') sortOptions = { acreEquivalent: -1 }

    const [total, properties] = await Promise.all([
      Property.countDocuments(query),
      Property.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ])

    const totalPages = Math.ceil(total / limitNum) || 1

    res.status(200).json({
      success: true,
      data: properties,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
      message: 'Properties retrieved successfully',
    })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/properties/:id
 * Retrieve a single property by Mongo ObjectId or slug.
 */
export const getPropertyById = async (req, res, next) => {
  try {
    const { id } = req.params

    let property = null
    if (mongoose.Types.ObjectId.isValid(id)) {
      property = await Property.findById(id).lean()
    } else {
      property = await Property.findOne({ slug: id }).lean()
    }

    if (!property) {
      return res.status(404).json({
        success: false,
        message: `Property parcel with identifier '${id}' was not found`,
      })
    }

    res.status(200).json({
      success: true,
      data: property,
      message: 'Property details retrieved successfully',
    })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/properties (and alias POST /api/listings)
 * Create or submit a new property.
 * Public submissions default to 'Pending Review' for safety.
 */
export const createProperty = async (req, res, next) => {
  try {
    const payload = { ...req.body }

    // If an authenticated Admin creates the listing, allow direct publication
    const isAdmin = req.user?.role === 'Admin'
    const status = isAdmin && payload.status ? payload.status : 'Pending Review'

    // Separate private contact info from public listing fields
    const ownerContact = {
      name: payload.name || '',
      phone: payload.phone || '',
      email: payload.email || '',
    }

    // Convert infrastructure if provided as string
    let infraList = []
    if (Array.isArray(payload.infrastructure)) {
      infraList = payload.infrastructure
    } else if (typeof payload.infrastructure === 'string') {
      infraList = payload.infrastructure.split(',').map(s => s.trim()).filter(Boolean)
    }

    // Compute priceAmount if not provided (e.g. from "₹50 Lakh" or numeric)
    let computedPriceAmount = payload.priceAmount || 0
    if (!computedPriceAmount && typeof payload.price === 'string') {
      const match = payload.price.match(/(\d+(\.\d+)?)/)
      if (match) computedPriceAmount = parseFloat(match[1])
    }

    const newProperty = new Property({
      title: payload.title,
      description: payload.description || '',
      location: payload.location,
      detailedAddress: payload.detailedAddress || '',
      propertyType: payload.propertyType,
      area: Number(payload.area) || 1,
      areaUnit: payload.areaUnit || 'Acre',
      price: payload.price,
      priceAmount: computedPriceAmount,
      priceFlexibility: payload.priceFlexibility || 'Negotiable based on payment terms',
      infrastructure: infraList,
      docStatus: payload.docStatus || '7/12 Extract Available',
      ownership: payload.ownership || 'Sole Landowner',
      images: payload.images && payload.images.length ? payload.images : ['/assets/property-agri.jpg'],
      status,
      ownerContact,
      createdBy: req.user?._id || null,
    })

    const saved = await newProperty.save()
    const referenceId = `PH-LIST-${saved._id.toString().slice(-6).toUpperCase()}`

    res.status(201).json({
      success: true,
      referenceId,
      data: saved,
      message: status === 'Published'
        ? 'Property published successfully.'
        : 'Your property has been submitted and is currently pending review by our acquisitions team.',
    })
  } catch (err) {
    next(err)
  }
}

/**
 * PATCH /api/properties/:id
 * Update permitted fields on a property. Requires Admin authorization.
 */
export const updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params

    const property = await Property.findById(id)
    if (!property) {
      return res.status(404).json({
        success: false,
        message: `Property with id '${id}' not found`,
      })
    }

    // Update permitted fields
    const updates = req.body
    const allowedFields = [
      'title', 'description', 'location', 'detailedAddress', 'propertyType',
      'area', 'areaUnit', 'price', 'priceAmount', 'priceFlexibility',
      'infrastructure', 'docStatus', 'ownership', 'images', 'featured', 'status',
    ]

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        property[field] = updates[field]
      }
    })

    const updated = await property.save()

    res.status(200).json({
      success: true,
      data: updated,
      message: 'Property updated successfully',
    })
  } catch (err) {
    next(err)
  }
}

/**
 * DELETE /api/properties/:id
 * Delete a property record. Protected: Admin only.
 */
export const deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params

    const property = await Property.findByIdAndDelete(id)
    if (!property) {
      return res.status(404).json({
        success: false,
        message: `Property with id '${id}' not found`,
      })
    }

    res.status(200).json({
      success: true,
      message: `Property parcel '${property.title}' was successfully removed.`,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/properties/admin/all (and alias GET /api/listings)
 * Retrieve all listings (including Pending Review) for the Admin console.
 */
export const getAllListingsAdmin = async (req, res, next) => {
  try {
    const listings = await Property.find()
      .select('+ownerContact')
      .sort({ createdAt: -1 })
      .lean()

    // Map to include submitter details if present
    const formatted = listings.map(l => ({
      id: l._id.toString(),
      name: l.ownerContact?.name || 'Verified Owner',
      phone: l.ownerContact?.phone || '',
      email: l.ownerContact?.email || '',
      title: l.title,
      propertyType: l.propertyType,
      location: l.location,
      area: `${l.area} ${l.areaUnit}`,
      price: l.price,
      status: l.status,
      docStatus: l.docStatus,
      createdAt: l.createdAt,
    }))

    res.status(200).json({
      success: true,
      listings: formatted,
      message: 'Admin listings retrieved successfully',
    })
  } catch (err) {
    next(err)
  }
}
