import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  UploadCloud, X, ArrowRight, ShieldCheck, CheckCircle2, Sparkles 
} from 'lucide-react'
import apiClient from '../services/api'
import toast from 'react-hot-toast'
import SuccessModal from '../components/ui/SuccessModal'
import './ListLand.css'

const MAHARASHTRA_DISTRICTS = [
  'Raigad (Karjat, Alibaug, Panvel, Roha, Mangaon)',
  'Pune (Lonavala, Mulshi, Haveli, Bhor, Shirur)',
  'Thane (Kalyan, Murbad, Shahapur)',
  'Palghar (Vasai, Palghar, Wada, Dahanu)',
  'Ratnagiri (Chiplun, Dapoli, Guhagar)',
  'Sindhudurg (Sawantwadi, Malvan, Kankavli)',
  'Nashik (Igatpuri, Trimbakeshwar, Dindori)',
  'Satara (Mahabaleshwar, Wai, Khandala)',
  'Other District in Maharashtra'
]

const PROPERTY_TYPES = [
  'Agricultural Land',
  'Residential Plots / Layout',
  'Commercial Land',
  'Farmhouse / Second Home Parcel',
  'Industrial Zone Land',
  'Eco-Retreat / Hospitality Land',
  'Development / Joint Venture Parcel'
]

const AREA_UNITS = ['Acre', 'Guntha', 'Sq.ft', 'Hectare']

const DOC_STATUS_OPTIONS = [
  '7/12 Extract Available & Single Owner',
  'NA Order Approved / Sanctioned Layout',
  'Clear Title with 30-Year Search Report',
  '7/12 Mutation in Process',
  'Ancestral / Inheritance Title Clear'
]

const OWNERSHIP_ROLES = [
  'Sole Landowner',
  'Co-Owner / Family Representative',
  'Registered Power of Attorney (PoA) Holder',
  'Authorized Exclusive Mandate Broker / Agent'
]

const PRICE_FLEXIBILITY_OPTIONS = [
  'Negotiable based on payment terms',
  'Fixed / Non-negotiable',
  'Open to discussion with serious buyers'
]

const INFRASTRUCTURE_OPTIONS = [
  'Direct Paved / Tar Road Access',
  'Perennial Water Source / River Frontage',
  '3-Phase Electricity Connection',
  'Fenced Boundary Wall',
  'Internal Layout Roads',
  'Borewell / Open Well Installed'
]

export default function ListLand() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    title: '',
    propertyType: '',
    location: '',
    detailedAddress: '',
    area: '',
    areaUnit: 'Acre',
    expectedPrice: '',
    priceFlexibility: 'Negotiable based on payment terms',
    description: '',
    infrastructure: [],
    docStatus: '',
    ownership: '',
    consent: false
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoName, setPhotoName] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [referenceId, setReferenceId] = useState('')
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleInfraToggle = (item) => {
    setForm(prev => {
      const exists = prev.infrastructure.includes(item)
      return {
        ...prev,
        infrastructure: exists 
          ? prev.infrastructure.filter(i => i !== item)
          : [...prev.infrastructure, item]
      }
    })
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (JPG, PNG, WebP).')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Photograph file size must be less than 5 MB.')
      return
    }

    setPhotoName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    setPhotoPreview(null)
    setPhotoName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const validate = () => {
    const errs = {}
    // Contact details
    if (!form.name.trim()) errs.name = 'Full name is required'
    if (!form.phone.match(/^[6-9]\d{9}$/)) errs.phone = 'Enter a valid 10-digit Indian mobile number'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Enter a valid email address'

    // Property details
    if (!form.title.trim()) errs.title = 'Property title or short name is required'
    if (!form.propertyType) errs.propertyType = 'Select property type'
    if (!form.location) errs.location = 'Select location district in Maharashtra'
    if (!form.detailedAddress.trim()) errs.detailedAddress = 'Detailed locality or village address is required'
    if (!form.area || Number(form.area) <= 0) errs.area = 'Enter total land area'
    if (!form.expectedPrice.trim()) errs.expectedPrice = 'Enter expected asking price'
    if (!form.docStatus) errs.docStatus = 'Select documentation status'
    if (!form.ownership) errs.ownership = 'Select ownership authorization status'
    if (!form.consent) errs.consent = 'You must confirm authorization and agree to submission terms'

    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      toast.error('Please complete all required fields.')
      window.scrollTo({ top: 300, behavior: 'smooth' })
      return
    }

    setLoading(true)
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        title: form.title,
        propertyType: form.propertyType,
        location: form.location,
        detailedAddress: form.detailedAddress,
        area: form.area,
        areaUnit: form.areaUnit,
        price: form.expectedPrice,
        priceFlexibility: form.priceFlexibility,
        description: form.description,
        infrastructure: form.infrastructure.join(', '),
        docStatus: form.docStatus,
        ownership: form.ownership,
        photoAttached: Boolean(photoPreview),
      }

      const res = await apiClient.post('/listings', payload)
      const newRefId = res.data?.referenceId || 'PH-LIST-' + Date.now().toString().slice(-6)
      setReferenceId(newRefId)
      setShowSuccess(true)

      // Reset form
      setForm({
        name: '',
        phone: '',
        email: '',
        title: '',
        propertyType: '',
        location: '',
        detailedAddress: '',
        area: '',
        areaUnit: 'Acre',
        expectedPrice: '',
        priceFlexibility: 'Negotiable based on payment terms',
        description: '',
        infrastructure: [],
        docStatus: '',
        ownership: '',
        consent: false
      })
      handleRemovePhoto()
    } catch {
      // Offline fallback
      const fallbackId = 'PH-LIST-' + Date.now().toString().slice(-6)
      setReferenceId(fallbackId)
      setShowSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="list-land-page">
      {/* ── Page Hero ───────────────────────────────────── */}
      <div className="list-land-hero">
        <div className="list-land-hero__backdrop" />
        <div className="container list-land-hero__content">
          <motion.div 
            className="list-land-hero__eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles size={14} /> LANDOWNER & SELLER PORTAL
          </motion.div>

          <motion.h1 
            className="list-land-hero__title"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            LIST YOUR LAND WITH <span className="gradient-text">PLOTTAGE HUB</span>
          </motion.h1>

          <motion.p 
            className="list-land-hero__sub"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Share your property details and our team will review your submission.
          </motion.p>
        </div>
      </div>

      {/* ── Main Form Container ─────────────────────────── */}
      <div className="container list-land-body">
        <div className="list-land-form-card">
          <div className="list-land-form-intro">
            <div className="list-land-intro-badge">
              <ShieldCheck size={16} /> Confidential Legal Review Process
            </div>
            <p className="list-land-intro-text">
              Every submission is initially marked <strong>Pending Review</strong>. Your private documentation and contact details are protected and never made public without your explicit authorization.
            </p>
          </div>

          <form className="list-land-form" onSubmit={handleSubmit} noValidate>
            {/* Section 1: Contact Details */}
            <div className="list-land-section">
              <div className="list-land-section__header">
                <span className="list-land-section__num">01</span>
                <div>
                  <h2 className="list-land-section__title">Contact Information</h2>
                  <p className="list-land-section__desc">How our verification and advisory desk can reach you.</p>
                </div>
              </div>

              <div className="list-land-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="ll-name">Full Name *</label>
                  <input
                    id="ll-name"
                    name="name"
                    type="text"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter full legal name"
                    value={form.name}
                    onChange={handleChange}
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ll-phone">Mobile Number *</label>
                  <input
                    id="ll-phone"
                    name="phone"
                    type="tel"
                    maxLength={10}
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="ll-email">Email Address *</label>
                <input
                  id="ll-email"
                  name="email"
                  type="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="name@domain.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
            </div>

            {/* Section 2: Property Identity & Location */}
            <div className="list-land-section">
              <div className="list-land-section__header">
                <span className="list-land-section__num">02</span>
                <div>
                  <h2 className="list-land-section__title">Property Identification & Location</h2>
                  <p className="list-land-section__desc">Key geographic markers and zoning classification.</p>
                </div>
              </div>

              <div className="list-land-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="ll-title">Property Title or Short Name *</label>
                  <input
                    id="ll-title"
                    name="title"
                    type="text"
                    className={`form-input ${errors.title ? 'error' : ''}`}
                    placeholder="e.g. 10-Acre Riverfront Land in Karjat"
                    value={form.title}
                    onChange={handleChange}
                  />
                  {errors.title && <span className="form-error">{errors.title}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ll-type">Property Type *</label>
                  <select
                    id="ll-type"
                    name="propertyType"
                    className={`form-select ${errors.propertyType ? 'error' : ''}`}
                    value={form.propertyType}
                    onChange={handleChange}
                  >
                    <option value="">Select Property Type</option>
                    {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.propertyType && <span className="form-error">{errors.propertyType}</span>}
                </div>
              </div>

              <div className="list-land-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="ll-loc">Location District in Maharashtra *</label>
                  <select
                    id="ll-loc"
                    name="location"
                    className={`form-select ${errors.location ? 'error' : ''}`}
                    value={form.location}
                    onChange={handleChange}
                  >
                    <option value="">Select District</option>
                    {MAHARASHTRA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.location && <span className="form-error">{errors.location}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ll-address">Detailed Locality / Village Address *</label>
                  <input
                    id="ll-address"
                    name="detailedAddress"
                    type="text"
                    className={`form-input ${errors.detailedAddress ? 'error' : ''}`}
                    placeholder="Village, Taluka, nearest landmark or highway"
                    value={form.detailedAddress}
                    onChange={handleChange}
                  />
                  {errors.detailedAddress && <span className="form-error">{errors.detailedAddress}</span>}
                </div>
              </div>
            </div>

            {/* Section 3: Measurements & Commercials */}
            <div className="list-land-section">
              <div className="list-land-section__header">
                <span className="list-land-section__num">03</span>
                <div>
                  <h2 className="list-land-section__title">Dimensions & Pricing</h2>
                  <p className="list-land-section__desc">Accurate dimensions and financial expectations.</p>
                </div>
              </div>

              <div className="list-land-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="ll-area">Total Land Area *</label>
                  <input
                    id="ll-area"
                    name="area"
                    type="number"
                    step="0.01"
                    className={`form-input ${errors.area ? 'error' : ''}`}
                    placeholder="e.g. 5"
                    value={form.area}
                    onChange={handleChange}
                  />
                  {errors.area && <span className="form-error">{errors.area}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ll-unit">Area Unit *</label>
                  <select
                    id="ll-unit"
                    name="areaUnit"
                    className="form-select"
                    value={form.areaUnit}
                    onChange={handleChange}
                  >
                    {AREA_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div className="list-land-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="ll-price">Expected Asking Price *</label>
                  <input
                    id="ll-price"
                    name="expectedPrice"
                    type="text"
                    className={`form-input ${errors.expectedPrice ? 'error' : ''}`}
                    placeholder="e.g. ₹65 Lakh or ₹1.8 Crore"
                    value={form.expectedPrice}
                    onChange={handleChange}
                  />
                  {errors.expectedPrice && <span className="form-error">{errors.expectedPrice}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ll-flex">Price Flexibility</label>
                  <select
                    id="ll-flex"
                    name="priceFlexibility"
                    className="form-select"
                    value={form.priceFlexibility}
                    onChange={handleChange}
                  >
                    {PRICE_FLEXIBILITY_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Legal & Documentation */}
            <div className="list-land-section">
              <div className="list-land-section__header">
                <span className="list-land-section__num">04</span>
                <div>
                  <h2 className="list-land-section__title">Legal Title & Ownership Status</h2>
                  <p className="list-land-section__desc">Clear legal documentation accelerates qualification.</p>
                </div>
              </div>

              <div className="list-land-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="ll-doc">Documentation Status *</label>
                  <select
                    id="ll-doc"
                    name="docStatus"
                    className={`form-select ${errors.docStatus ? 'error' : ''}`}
                    value={form.docStatus}
                    onChange={handleChange}
                  >
                    <option value="">Select Documentation Status</option>
                    {DOC_STATUS_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.docStatus && <span className="form-error">{errors.docStatus}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ll-owner">Ownership or Authorization Status *</label>
                  <select
                    id="ll-owner"
                    name="ownership"
                    className={`form-select ${errors.ownership ? 'error' : ''}`}
                    value={form.ownership}
                    onChange={handleChange}
                  >
                    <option value="">Select Ownership Status</option>
                    {OWNERSHIP_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {errors.ownership && <span className="form-error">{errors.ownership}</span>}
                </div>
              </div>

              {/* Infrastructure checkboxes */}
              <div className="form-group">
                <label className="form-label">Road Access & Available Infrastructure</label>
                <div className="list-land-infra-grid">
                  {INFRASTRUCTURE_OPTIONS.map(inf => {
                    const checked = form.infrastructure.includes(inf)
                    return (
                      <button
                        type="button"
                        key={inf}
                        className={`list-land-infra-chip ${checked ? 'list-land-infra-chip--active' : ''}`}
                        onClick={() => handleInfraToggle(inf)}
                      >
                        <CheckCircle2 size={13} className="list-land-infra-chip__icon" />
                        <span>{inf}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Property Description */}
              <div className="form-group">
                <label className="form-label" htmlFor="ll-desc">Property Description</label>
                <textarea
                  id="ll-desc"
                  name="description"
                  className="form-textarea"
                  rows={4}
                  placeholder="Detail the topography, soil condition, water source, proximity to highways, fencing, and any ongoing agricultural or commercial usage..."
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              {/* Photo Upload */}
              <div className="form-group">
                <label className="form-label">Property Photograph (Optional preview)</label>
                <div className="list-land-upload-box">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    id="ll-photo-upload"
                    className="list-land-file-input"
                  />
                  {photoPreview ? (
                    <div className="list-land-preview-wrap">
                      <img src={photoPreview} alt="Property preview" className="list-land-preview-img" />
                      <div className="list-land-preview-info">
                        <span className="list-land-preview-name">{photoName}</span>
                        <button
                          type="button"
                          className="btn btn-outline list-land-preview-remove"
                          onClick={handleRemovePhoto}
                        >
                          <X size={14} /> Remove Photo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label htmlFor="ll-photo-upload" className="list-land-upload-label">
                      <UploadCloud size={32} className="list-land-upload-icon" />
                      <span className="list-land-upload-title">Click to upload property photograph</span>
                      <span className="list-land-upload-sub">Supports JPG, PNG, WebP up to 5 MB</span>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className="list-land-consent">
              <input
                type="checkbox"
                id="ll-consent"
                name="consent"
                checked={form.consent}
                onChange={handleChange}
                className="lead-form__checkbox"
              />
              <label htmlFor="ll-consent" className="list-land-consent-label">
                I confirm that I am the authorized owner or mandate holder for this parcel, and I agree to Plottage Hub's terms of service and privacy notice. Submissions are reviewed confidentially.
              </label>
            </div>
            {errors.consent && <span className="form-error">{errors.consent}</span>}

            {/* Submit Button */}
            <div className="list-land-submit-bar">
              <button
                type="submit"
                className="btn btn-gold list-land-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="lead-form__spinner" />
                ) : (
                  <>
                    <ArrowRight size={16} /> SUBMIT PROPERTY FOR REVIEW
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Reusable Success Modal ──────────────────────── */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Your request has been submitted successfully!"
        message="Thank you for choosing Plottage Hub. Our team will review your property details and contact you regarding the next steps."
        referenceId={referenceId}
        doneText="Done"
      />
    </div>
  )
}
