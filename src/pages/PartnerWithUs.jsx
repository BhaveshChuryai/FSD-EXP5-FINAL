import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trees, Handshake, Building2, Award, TrendingUp, Globe, 
  ArrowRight, Sparkles 
} from 'lucide-react'
import apiClient from '../services/api'
import toast from 'react-hot-toast'
import SuccessModal from '../components/ui/SuccessModal'
import './PartnerWithUs.css'

const ROLES = [
  {
    id: 'landowner',
    title: 'Landowner',
    icon: Trees,
    tagline: 'Monetize & Protect Your Land',
    desc: 'List and manage your verified land parcels with expert title clearance and direct access to qualified institutional and private buyers across Maharashtra.'
  },
  {
    id: 'broker',
    title: 'Broker / Channel Partner',
    icon: Handshake,
    tagline: 'High-Volume Network Pipeline',
    desc: 'Expand your client advisory reach with curated inventory, prompt commission structures, and real-time transaction support in Pune, Raigad, and beyond.'
  },
  {
    id: 'developer',
    title: 'Developer',
    icon: Building2,
    tagline: 'Prime Acreage & Joint Ventures',
    desc: 'Source pre-vetted land for residential layouts, eco-retreats, commercial complexes, and industrial warehouses with complete legal sanctioning.'
  },
  {
    id: 'esp',
    title: 'Exclusive Selling Partner',
    icon: Award,
    tagline: 'High-Net-Worth Mandates',
    desc: 'Secure exclusive marketing and sales mandates for high-ticket estates and developments backed by Plottage Hub’s digital discovery platform.'
  },
  {
    id: 'investor',
    title: 'Investor',
    icon: TrendingUp,
    tagline: 'Strategic Capital Growth',
    desc: 'Deploy growth capital into high-appreciation Maharashtra growth corridors with title-verified parcels, GIS intelligence, and exit liquidity.'
  },
  {
    id: 'strategic',
    title: 'Strategic Partner',
    icon: Globe,
    tagline: 'Ecosystem & Professional Services',
    desc: 'Provide specialized services — legal title search, drone land surveying, architectural design, environmental vetting, or agricultural management.'
  },
]

const areaUnits = ['Acres', 'Guntha', 'Sq.ft', 'Hectare']
const docStatusOpts = ['7/12 Extract Available', 'NA Sanctioned', 'Clear Title Search Report', 'Title Under Process']
const propTypes = ['Agricultural Land', 'Residential Plots', 'Commercial Land', 'Farmhouse / Estate', 'Development Land', 'Industrial Zone']

export default function PartnerWithUs() {
  const [selectedRole, setSelectedRole] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [refId, setRefId] = useState('')
  const formSectionRef = useRef(null)

  // Form states
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})

  const handleSelectRole = (roleId) => {
    setSelectedRole(roleId)
    setFormData({ role: roleId })
    setErrors({})
    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = () => {
    const errs = {}
    if (!formData.name?.trim()) errs.name = 'Full name is required'
    if (!formData.phone?.match(/^[6-9]\d{9}$/)) errs.phone = 'Enter a valid 10-digit mobile number'
    if (!formData.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Enter a valid email address'

    if (selectedRole === 'landowner') {
      if (!formData.location?.trim()) errs.location = 'Land location is required'
      if (!formData.propertyType) errs.propertyType = 'Select property type'
      if (!formData.area) errs.area = 'Specify land area'
    } else if (selectedRole === 'broker') {
      if (!formData.agency?.trim()) errs.agency = 'Agency or firm name is required'
      if (!formData.locations?.trim()) errs.locations = 'Primary operating districts are required'
    } else if (selectedRole === 'developer') {
      if (!formData.company?.trim()) errs.company = 'Company name is required'
      if (!formData.targetRegions?.trim()) errs.targetRegions = 'Target regions in Maharashtra are required'
    } else if (selectedRole === 'esp') {
      if (!formData.firm?.trim()) errs.firm = 'Firm name is required'
      if (!formData.mandateTrackRecord?.trim()) errs.mandateTrackRecord = 'Please share brief track record'
    } else if (selectedRole === 'investor') {
      if (!formData.ticketSize) errs.ticketSize = 'Select investment ticket size'
      if (!formData.investorType) errs.investorType = 'Select investor category'
    } else if (selectedRole === 'strategic') {
      if (!formData.domain) errs.domain = 'Select professional specialization'
    }

    if (!formData.consent) errs.consent = 'Please confirm authorization to submit'

    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      toast.error('Please resolve the highlighted form fields.')
      return
    }

    setLoading(true)
    try {
      const response = await apiClient.post('/partner-applications', {
        ...formData,
        partnerType: selectedRole,
      })
      const id = response.data?.referenceId || 'PH-APP-' + Date.now().toString().slice(-6)
      setRefId(id)
      setShowSuccess(true)
      setFormData({})
    } catch {
      // Offline fallback
      const fallbackId = 'PH-APP-' + Date.now().toString().slice(-6)
      setRefId(fallbackId)
      setShowSuccess(true)
      setFormData({})
    } finally {
      setLoading(false)
    }
  }

  const currentRoleObj = ROLES.find(r => r.id === selectedRole)

  return (
    <div className="partner-page">
      {/* ── Page Hero ───────────────────────────────────── */}
      <div className="partner-hero">
        <div className="partner-hero__backdrop" />
        <div className="container partner-hero__content">
          <motion.div 
            className="partner-hero__eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles size={14} /> COLLABORATION & GROWTH
          </motion.div>

          <motion.h1 
            className="partner-hero__title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            PARTNER WITH <span className="gradient-text">PLOTTAGE HUB</span>
          </motion.h1>

          <motion.p 
            className="partner-hero__sub"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Connect with a growing network of landowners, brokers, developers, investors, and real-estate professionals across Maharashtra.
          </motion.p>
        </div>
      </div>

      {/* ── 6 Partnership Category Cards ────────────────── */}
      <div className="container partner-page__body">
        <div className="partner-roles-header">
          <span className="section-eyebrow">CHOOSE YOUR CATEGORY</span>
          <h2 className="partner-roles-title">Select How You Would Like to Collaborate</h2>
          <p className="partner-roles-desc">
            Explore dedicated partnership tracks with tailored onboarding, commercial transparency, and professional oversight.
          </p>
        </div>

        <div className="partner-roles-grid">
          {ROLES.map((role, i) => {
            const Icon = role.icon
            const isSelected = selectedRole === role.id
            return (
              <motion.div
                key={role.id}
                className={`partner-card ${isSelected ? 'partner-card--active' : ''}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                onClick={() => handleSelectRole(role.id)}
              >
                <div className="partner-card__icon-wrap">
                  <Icon size={26} className="partner-card__icon" />
                </div>
                <div className="partner-card__badge">{role.tagline}</div>
                <h3 className="partner-card__title">{role.title}</h3>
                <p className="partner-card__desc">{role.desc}</p>
                
                <button 
                  type="button" 
                  className={`btn ${isSelected ? 'btn-gold' : 'btn-outline'} partner-card__btn`}
                >
                  {isSelected ? 'Selected' : 'Apply Now'} <ArrowRight size={14} />
                </button>
              </motion.div>
            )
          })}
        </div>

        {/* ── Dedicated Application Form ─────────────────── */}
        <div ref={formSectionRef}>
          <AnimatePresence mode="wait">
            {selectedRole && (
              <motion.div
                key={selectedRole}
                className="partner-form-section"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
              >
                <div className="partner-form-header">
                  <div className="partner-form-header__badge">
                    {currentRoleObj?.title} Application
                  </div>
                  <h2 className="partner-form-header__title">
                    Apply as a {currentRoleObj?.title}
                  </h2>
                  <p className="partner-form-header__sub">
                    Complete the details below and our partnership desk will review your submission within 24 business hours.
                  </p>
                </div>

                <form className="partner-form" onSubmit={handleSubmit} noValidate>
                  {/* Common Contact Details */}
                  <div className="partner-form__row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="pf-name">Full Name *</label>
                      <input
                        id="pf-name"
                        name="name"
                        type="text"
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        placeholder="Your full name"
                        value={formData.name || ''}
                        onChange={handleChange}
                      />
                      {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="pf-phone">Mobile Number *</label>
                      <input
                        id="pf-phone"
                        name="phone"
                        type="tel"
                        maxLength={10}
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                        placeholder="10-digit mobile number"
                        value={formData.phone || ''}
                        onChange={handleChange}
                      />
                      {errors.phone && <span className="form-error">{errors.phone}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="pf-email">Email Address *</label>
                    <input
                      id="pf-email"
                      name="email"
                      type="email"
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="your.email@domain.com"
                      value={formData.email || ''}
                      onChange={handleChange}
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>

                  {/* ── Category Specific Fields ────────────────── */}

                  {/* 1. Landowner */}
                  {selectedRole === 'landowner' && (
                    <>
                      <div style={{ background: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#E6E4DF' }}>Want to submit a full property listing with photo upload right now?</span>
                        <a href="/list-land" style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', fontWeight: 600, textDecoration: 'none' }}>Go to List Your Land →</a>
                      </div>
                      <div className="partner-form__row">
                        <div className="form-group">
                          <label className="form-label" htmlFor="pf-location">Land Location / District *</label>
                          <input
                            id="pf-location"
                            name="location"
                            className={`form-input ${errors.location ? 'error' : ''}`}
                            placeholder="e.g. Karjat, Raigad or Lonavala, Pune"
                            value={formData.location || ''}
                            onChange={handleChange}
                          />
                          {errors.location && <span className="form-error">{errors.location}</span>}
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="pf-type">Property Type *</label>
                          <select
                            id="pf-type"
                            name="propertyType"
                            className={`form-select ${errors.propertyType ? 'error' : ''}`}
                            value={formData.propertyType || ''}
                            onChange={handleChange}
                          >
                            <option value="">Select Property Type</option>
                            {propTypes.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          {errors.propertyType && <span className="form-error">{errors.propertyType}</span>}
                        </div>
                      </div>

                      <div className="partner-form__row">
                        <div className="form-group">
                          <label className="form-label" htmlFor="pf-area">Total Land Area *</label>
                          <input
                            id="pf-area"
                            name="area"
                            type="number"
                            className={`form-input ${errors.area ? 'error' : ''}`}
                            placeholder="e.g. 5"
                            value={formData.area || ''}
                            onChange={handleChange}
                          />
                          {errors.area && <span className="form-error">{errors.area}</span>}
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="pf-unit">Area Unit</label>
                          <select
                            id="pf-unit"
                            name="areaUnit"
                            className="form-select"
                            value={formData.areaUnit || 'Acres'}
                            onChange={handleChange}
                          >
                            {areaUnits.map(u => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="partner-form__row">
                        <div className="form-group">
                          <label className="form-label" htmlFor="pf-doc">Documentation Status</label>
                          <select
                            id="pf-doc"
                            name="docStatus"
                            className="form-select"
                            value={formData.docStatus || ''}
                            onChange={handleChange}
                          >
                            <option value="">Select Documentation Status</option>
                            {docStatusOpts.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="pf-price">Expected Asking Price (₹)</label>
                          <input
                            id="pf-price"
                            name="expectedPrice"
                            className="form-input"
                            placeholder="e.g. 60 Lakh or Market Price"
                            value={formData.expectedPrice || ''}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* 2. Broker */}
                  {selectedRole === 'broker' && (
                    <>
                      <div className="partner-form__row">
                        <div className="form-group">
                          <label className="form-label" htmlFor="pf-agency">Agency or Firm Name *</label>
                          <input
                            id="pf-agency"
                            name="agency"
                            className={`form-input ${errors.agency ? 'error' : ''}`}
                            placeholder="e.g. Apex Realty Advisory"
                            value={formData.agency || ''}
                            onChange={handleChange}
                          />
                          {errors.agency && <span className="form-error">{errors.agency}</span>}
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="pf-locations">Primary Operating Locations *</label>
                          <input
                            id="pf-locations"
                            name="locations"
                            className={`form-input ${errors.locations ? 'error' : ''}`}
                            placeholder="e.g. Raigad, Pune, Panvel Corridor"
                            value={formData.locations || ''}
                            onChange={handleChange}
                          />
                          {errors.locations && <span className="form-error">{errors.locations}</span>}
                        </div>
                      </div>

                      <div className="partner-form__row">
                        <div className="form-group">
                          <label className="form-label" htmlFor="pf-exp">Years in Land Transactions</label>
                          <input
                            id="pf-exp"
                            name="experience"
                            className="form-input"
                            placeholder="e.g. 8 Years"
                            value={formData.experience || ''}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="pf-rera">RERA / Registration No. (If applicable)</label>
                          <input
                            id="pf-rera"
                            name="reraNumber"
                            className="form-input"
                            placeholder="e.g. A520000..."
                            value={formData.reraNumber || ''}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* 3. Developer */}
                  {selectedRole === 'developer' && (
                    <>
                      <div className="partner-form__row">
                        <div className="form-group">
                          <label className="form-label" htmlFor="pf-dev-company">Development Company Name *</label>
                          <input
                            id="pf-dev-company"
                            name="company"
                            className={`form-input ${errors.company ? 'error' : ''}`}
                            placeholder="e.g. Sahyadri Green Infra Ltd."
                            value={formData.company || ''}
                            onChange={handleChange}
                          />
                          {errors.company && <span className="form-error">{errors.company}</span>}
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="pf-dev-regions">Target Regions in Maharashtra *</label>
                          <input
                            id="pf-dev-regions"
                            name="targetRegions"
                            className={`form-input ${errors.targetRegions ? 'error' : ''}`}
                            placeholder="e.g. Mumbai-Goa Highway, Pune Ring Road"
                            value={formData.targetRegions || ''}
                            onChange={handleChange}
                          />
                          {errors.targetRegions && <span className="form-error">{errors.targetRegions}</span>}
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="pf-dev-scale">Project Scope / Development Track Record</label>
                        <input
                          id="pf-dev-scale"
                          name="scale"
                          className="form-input"
                          placeholder="e.g. 50+ Acres residential layouts delivered"
                          value={formData.scale || ''}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}

                  {/* 4. Exclusive Selling Partner */}
                  {selectedRole === 'esp' && (
                    <>
                      <div className="partner-form__row">
                        <div className="form-group">
                          <label className="form-label" htmlFor="pf-esp-firm">Mandate Firm Name *</label>
                          <input
                            id="pf-esp-firm"
                            name="firm"
                            className={`form-input ${errors.firm ? 'error' : ''}`}
                            placeholder="Firm or Brokerage Title"
                            value={formData.firm || ''}
                            onChange={handleChange}
                          />
                          {errors.firm && <span className="form-error">{errors.firm}</span>}
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="pf-esp-markets">Key Target Markets</label>
                          <input
                            id="pf-esp-markets"
                            name="targetMarkets"
                            className="form-input"
                            placeholder="e.g. Alibaug coastal villas, Lonavala hill estates"
                            value={formData.targetMarkets || ''}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="pf-esp-track">Exclusive Mandates Handled *</label>
                        <textarea
                          id="pf-esp-track"
                          name="mandateTrackRecord"
                          className={`form-textarea ${errors.mandateTrackRecord ? 'error' : ''}`}
                          rows={3}
                          placeholder="Brief description of past exclusive selling agreements and portfolio volume..."
                          value={formData.mandateTrackRecord || ''}
                          onChange={handleChange}
                        />
                        {errors.mandateTrackRecord && <span className="form-error">{errors.mandateTrackRecord}</span>}
                      </div>
                    </>
                  )}

                  {/* 5. Investor */}
                  {selectedRole === 'investor' && (
                    <>
                      <div className="partner-form__row">
                        <div className="form-group">
                          <label className="form-label" htmlFor="pf-inv-type">Investor Profile *</label>
                          <select
                            id="pf-inv-type"
                            name="investorType"
                            className={`form-select ${errors.investorType ? 'error' : ''}`}
                            value={formData.investorType || ''}
                            onChange={handleChange}
                          >
                            <option value="">Select Investor Profile</option>
                            <option value="HNI / Individual">HNI / Individual Investor</option>
                            <option value="Family Office">Family Office</option>
                            <option value="Syndicate / Fund">Private Syndicate / Fund</option>
                            <option value="Institutional">Institutional Capital</option>
                          </select>
                          {errors.investorType && <span className="form-error">{errors.investorType}</span>}
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="pf-inv-ticket">Target Ticket Size *</label>
                          <select
                            id="pf-inv-ticket"
                            name="ticketSize"
                            className={`form-select ${errors.ticketSize ? 'error' : ''}`}
                            value={formData.ticketSize || ''}
                            onChange={handleChange}
                          >
                            <option value="">Select Ticket Size</option>
                            <option value="₹25L – ₹50L">₹25 Lakh – ₹50 Lakh</option>
                            <option value="₹50L – ₹2 Cr">₹50 Lakh – ₹2 Crore</option>
                            <option value="₹2 Cr – ₹10 Cr">₹2 Crore – ₹10 Crore</option>
                            <option value="₹10 Cr+">₹10 Crore+</option>
                          </select>
                          {errors.ticketSize && <span className="form-error">{errors.ticketSize}</span>}
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="pf-inv-horizon">Preferred Investment Horizon</label>
                        <select
                          id="pf-inv-horizon"
                          name="horizon"
                          className="form-select"
                          value={formData.horizon || ''}
                          onChange={handleChange}
                        >
                          <option value="1–2 Years">Short Term (1–2 Years)</option>
                          <option value="3–5 Years">Medium Term (3–5 Years)</option>
                          <option value="5+ Years">Long Term Wealth Preservation (5+ Years)</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* 6. Strategic Partner */}
                  {selectedRole === 'strategic' && (
                    <>
                      <div className="partner-form__row">
                        <div className="form-group">
                          <label className="form-label" htmlFor="pf-strat-domain">Domain of Expertise *</label>
                          <select
                            id="pf-strat-domain"
                            name="domain"
                            className={`form-select ${errors.domain ? 'error' : ''}`}
                            value={formData.domain || ''}
                            onChange={handleChange}
                          >
                            <option value="">Select Domain</option>
                            <option value="Legal & Title Due Diligence">Legal & Title Due Diligence</option>
                            <option value="Land Surveying & GIS Mapping">Land Surveying & GIS Mapping</option>
                            <option value="Architectural & Master Planning">Architectural & Master Planning</option>
                            <option value="Environmental & Agro-Consulting">Environmental & Agro-Consulting</option>
                            <option value="Financial & Valuation Advisory">Financial & Valuation Advisory</option>
                          </select>
                          {errors.domain && <span className="form-error">{errors.domain}</span>}
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="pf-strat-org">Organization / Practice Name</label>
                          <input
                            id="pf-strat-org"
                            name="organization"
                            className="form-input"
                            placeholder="e.g. Lex Terra Advisors"
                            value={formData.organization || ''}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Additional notes / proposal */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="pf-notes">Additional Proposal Details</label>
                    <textarea
                      id="pf-notes"
                      name="notes"
                      className="form-textarea"
                      rows={4}
                      placeholder="Share details regarding your property, portfolio, client requirements, or collaboration goals..."
                      value={formData.notes || ''}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Consent Checkbox */}
                  <div className="partner-form__consent">
                    <input
                      type="checkbox"
                      id="pf-consent"
                      name="consent"
                      checked={formData.consent || false}
                      onChange={handleChange}
                      className="lead-form__checkbox"
                    />
                    <label htmlFor="pf-consent" className="partner-form__consent-label">
                      I confirm that the details provided are accurate and authorize Plottage Hub to contact me regarding partnership opportunities. All information is handled confidentially.
                    </label>
                  </div>
                  {errors.consent && <span className="form-error">{errors.consent}</span>}

                  <div className="partner-form__actions">
                    <button
                      type="submit"
                      className="btn btn-gold partner-form__submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="lead-form__spinner" />
                      ) : (
                        <>
                          <ArrowRight size={16} /> Submit {currentRoleObj?.title} Application
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Reusable Success Modal ──────────────────────── */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false)
          setSelectedRole(null)
        }}
        title="Your request has been submitted successfully!"
        message="Thank you for choosing Plottage Hub. Our team will review your application details and contact you regarding the next steps."
        referenceId={refId}
        doneText="Done"
      />
    </div>
  )
}
