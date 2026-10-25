import PartnerApplication from '../models/PartnerApplication.js'

/**
 * POST /api/partner-applications
 * Public onboarding submission for Landowners, Channel Partners, and Developers.
 */
export const createApplication = async (req, res, next) => {
  try {
    const payload = req.body

    const sanitizedDetails = {}
    const detailKeys = [
      'reraNumber', 'experience', 'notes', 'company', 'agency', 'firm',
      'locations', 'targetRegions', 'ticketSize', 'investorType',
      'domain', 'mandateTrackRecord', 'area', 'propertyType'
    ]
    detailKeys.forEach(k => {
      if (payload[k] !== undefined && payload[k] !== '') {
        sanitizedDetails[k] = payload[k]
      }
    })

    const newApp = new PartnerApplication({
      partnerType: payload.partnerType || 'Landowner',
      name: payload.name,
      phone: payload.phone,
      email: payload.email || undefined,
      location: payload.location || 'Maharashtra',
      docStatus: payload.docStatus || 'Submitted',
      details: sanitizedDetails,
    })

    const saved = await newApp.save()

    res.status(201).json({
      success: true,
      referenceId: saved.referenceId,
      message: 'Partner application submitted successfully.',
    })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/partner-applications
 * Retrieve partner applications (Admin console).
 */
export const getApplications = async (req, res, next) => {
  try {
    const apps = await PartnerApplication.find().sort({ createdAt: -1 }).lean()

    res.status(200).json({
      success: true,
      applications: apps,
      message: 'Partner applications retrieved successfully.',
    })
  } catch (err) {
    next(err)
  }
}

/**
 * PATCH /api/partner-applications/:id
 * Update partner application status.
 */
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const app = await PartnerApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )

    if (!app) {
      return res.status(404).json({
        success: false,
        message: `Application with id '${id}' not found.`,
      })
    }

    res.status(200).json({
      success: true,
      data: app,
      message: `Partner application marked as '${status}'.`,
    })
  } catch (err) {
    next(err)
  }
}
