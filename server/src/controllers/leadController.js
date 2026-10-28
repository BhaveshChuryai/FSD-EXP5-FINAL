import Lead from '../models/Lead.js'

/**
 * POST /api/leads (and alias POST /api/enquiries)
 * Public endpoint to submit buyer requirements or property site visit requests.
 */
export const createLead = async (req, res, next) => {
  try {
    const payload = req.body

    const newLead = new Lead({
      name: payload.name,
      phone: payload.phone,
      email: payload.email || undefined,
      propertyType: payload.propertyType || 'Agricultural Land',
      location: payload.location || payload.propertyLocation || 'Maharashtra',
      minBudget: payload.minBudget ? Number(payload.minBudget) : 0,
      maxBudget: payload.maxBudget ? Number(payload.maxBudget) : 0,
      area: payload.area ? String(payload.area) : '',
      areaUnit: payload.areaUnit || 'Acre',
      purpose: payload.purpose || 'Investment',
      timeline: payload.timeline || 'Exploring / No fixed timeline',
      requirements: payload.requirements || payload.message || '',
      propertyId: payload.propertyId || null,
      propertyTitle: payload.propertyTitle || null,
      preferredDate: payload.preferredDate || null,
    })

    const saved = await newLead.save()

    // Notify admin room via Socket.IO (only emitted after successful DB write)
    const io = req.app.locals.io
    if (io) {
      io.to('admin_room').emit('admin:new_lead', {
        referenceId: saved.referenceId,
        name: saved.name,
        propertyTitle: saved.propertyTitle || null,
        location: saved.location,
        propertyType: saved.propertyType,
        createdAt: saved.createdAt,
      })
    }

    res.status(201).json({
      success: true,
      referenceId: saved.referenceId,
      message: 'Buyer requirement / enquiry submitted successfully.',
    })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/leads
 * Protected: Admin/Staff only. Retrieve all leads with status filtering.
 */
export const getLeads = async (req, res, next) => {
  try {
    const { status } = req.query
    const filter = {}
    if (status) filter.status = status

    const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean()

    res.status(200).json({
      success: true,
      data: leads,
      total: leads.length,
      message: 'Leads retrieved successfully.',
    })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/leads/:id
 * Protected: Admin/Staff only. Retrieve single lead details.
 */
export const getLeadById = async (req, res, next) => {
  try {
    const { id } = req.params
    const lead = await Lead.findById(id).lean()

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: `Lead with id '${id}' not found.`,
      })
    }

    res.status(200).json({
      success: true,
      data: lead,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * PATCH /api/leads/:id
 * Protected: Admin/Staff only. Update lead status.
 */
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const lead = await Lead.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: `Lead with id '${id}' not found.`,
      })
    }

    res.status(200).json({
      success: true,
      data: lead,
      message: `Lead status updated to '${status}'.`,
    })
  } catch (err) {
    next(err)
  }
}
