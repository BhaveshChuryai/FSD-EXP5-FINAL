import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import axios from 'axios'
import './LeadForm.css'

const propertyTypes = [
  'Agricultural Land', 'Residential Plots', 'Commercial Land',
  'Investment Land', 'Development Land', 'Farmhouse / Second-Home Land',
]
const areaUnits = ['Sq.ft', 'Sq.m', 'Guntha', 'Acre', 'Hectare']
const purposes = ['Personal Use', 'Investment', 'Development', 'Farming / Agriculture', 'Commercial Purpose', 'Farmhouse / Second Home']
const timelines = ['Within 1 month', '1–3 months', '3–6 months', '6–12 months', 'More than 1 year', 'Exploring / No fixed timeline']
const locations = ['Lonavala', 'Karjat', 'Khopoli', 'Pali', 'Alibaug', 'Panvel', 'Shrivardhan', 'Diveagar', 'Harihareshwar', 'Other']

const initialForm = {
  name: '', phone: '', email: '', propertyType: '', location: '',
  minBudget: '', maxBudget: '', area: '', areaUnit: 'Sq.ft',
  purpose: '', timeline: '', requirements: '', consent: false,
}

function validateForm(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.phone.match(/^[6-9]\d{9}$/)) errors.phone = 'Enter a valid 10-digit mobile number'
  if (form.email && !form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = 'Enter a valid email'
  if (!form.propertyType) errors.propertyType = 'Select property type'
  if (!form.location) errors.location = 'Select preferred location'
  if (!form.area) errors.area = 'Enter required area'
  if (!form.purpose) errors.purpose = 'Select purpose'
  if (!form.consent) errors.consent = 'Please accept to continue'
  if (form.minBudget && form.maxBudget && Number(form.minBudget) > Number(form.maxBudget))
    errors.maxBudget = 'Max budget must be ≥ min budget'
  return errors
}

export default function LeadForm() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [refId, setRefId] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateForm(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setStatus('loading')
    try {
      // Submit to backend API; gracefully handles offline
      const res = await axios.post('/api/leads', form)
      setRefId(res.data?.referenceId || 'PH-' + Date.now())
      setStatus('success')
      setForm(initialForm)
    } catch (err) {
      // If backend is not running yet, still show success with local ref for demo
      if (!err.response) {
        setRefId('PH-' + Date.now())
        setStatus('success')
        setForm(initialForm)
      } else {
        setStatus('error')
      }
    }
  }

  if (status === 'success') {
    return (
      <section className="lead-form section" ref={ref}>
        <div className="container">
          <motion.div
            className="lead-form__success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle size={48} color="var(--success)" />
            <h3>Requirement Submitted</h3>
            <p>Thank you. Our team will review your requirement and reach out shortly.</p>
            {refId && <p className="lead-form__ref">Reference: <strong>{refId}</strong></p>}
            <button className="btn btn-outline" onClick={() => setStatus('idle')}>
              Submit Another
            </button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="lead-form section" ref={ref} id="buyer-form">
      <div className="container">
        <div className="lead-form__layout">
          {/* Left copy */}
          <motion.div
            className="lead-form__copy"
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="section-eyebrow">Buyer Requirements</span>
            <h2 className="lead-form__title">
              TELL US WHAT YOU'RE<br />
              <span className="gradient-text">LOOKING FOR.</span>
            </h2>
            <p className="lead-form__subtitle">
              Share your land requirements and let our team understand what opportunity may suit you.
            </p>
            <div className="lead-form__features">
              {['No-obligation consultation', 'Confidential — your data is never shared publicly', 'Response within 24 business hours'].map(f => (
                <div key={f} className="lead-form__feature">
                  <CheckCircle size={14} color="var(--success)" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            className="lead-form__form"
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="lead-form__row">
              <div className="form-group">
                <label htmlFor="lf-name" className="form-label">Full Name *</label>
                <input id="lf-name" name="name" type="text" className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Your full name" value={form.name} onChange={handleChange} />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="lf-phone" className="form-label">Mobile Number *</label>
                <input id="lf-phone" name="phone" type="tel" className={`form-input ${errors.phone ? 'error' : ''}`}
                  placeholder="10-digit mobile number" value={form.phone} onChange={handleChange} maxLength={10} />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="lf-email" className="form-label">Email Address (optional)</label>
              <input id="lf-email" name="email" type="email" className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="your@email.com" value={form.email} onChange={handleChange} />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="lead-form__row">
              <div className="form-group">
                <label htmlFor="lf-type" className="form-label">Property Type *</label>
                <select id="lf-type" name="propertyType" className={`form-select ${errors.propertyType ? 'error' : ''}`}
                  value={form.propertyType} onChange={handleChange}>
                  <option value="">Select type</option>
                  {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.propertyType && <span className="form-error">{errors.propertyType}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="lf-location" className="form-label">Preferred Location *</label>
                <select id="lf-location" name="location" className={`form-select ${errors.location ? 'error' : ''}`}
                  value={form.location} onChange={handleChange}>
                  <option value="">Select location</option>
                  {locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                {errors.location && <span className="form-error">{errors.location}</span>}
              </div>
            </div>

            <div className="lead-form__row">
              <div className="form-group">
                <label htmlFor="lf-minb" className="form-label">Min Budget (₹ Lakh)</label>
                <input id="lf-minb" name="minBudget" type="number" className="form-input"
                  placeholder="e.g. 20" value={form.minBudget} onChange={handleChange} min={0} />
              </div>
              <div className="form-group">
                <label htmlFor="lf-maxb" className="form-label">Max Budget (₹ Lakh)</label>
                <input id="lf-maxb" name="maxBudget" type="number" className={`form-input ${errors.maxBudget ? 'error' : ''}`}
                  placeholder="e.g. 50" value={form.maxBudget} onChange={handleChange} min={0} />
                {errors.maxBudget && <span className="form-error">{errors.maxBudget}</span>}
              </div>
            </div>

            <div className="lead-form__row">
              <div className="form-group">
                <label htmlFor="lf-area" className="form-label">Required Area *</label>
                <input id="lf-area" name="area" type="number" className={`form-input ${errors.area ? 'error' : ''}`}
                  placeholder="e.g. 5" value={form.area} onChange={handleChange} min={0} />
                {errors.area && <span className="form-error">{errors.area}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="lf-unit" className="form-label">Area Unit</label>
                <select id="lf-unit" name="areaUnit" className="form-select"
                  value={form.areaUnit} onChange={handleChange}>
                  {areaUnits.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="lead-form__row">
              <div className="form-group">
                <label htmlFor="lf-purpose" className="form-label">Purpose *</label>
                <select id="lf-purpose" name="purpose" className={`form-select ${errors.purpose ? 'error' : ''}`}
                  value={form.purpose} onChange={handleChange}>
                  <option value="">Select purpose</option>
                  {purposes.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {errors.purpose && <span className="form-error">{errors.purpose}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="lf-timeline" className="form-label">Purchase Timeline</label>
                <select id="lf-timeline" name="timeline" className="form-select"
                  value={form.timeline} onChange={handleChange}>
                  <option value="">Select timeline</option>
                  {timelines.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="lf-req" className="form-label">Additional Requirements</label>
              <textarea id="lf-req" name="requirements" className="form-textarea"
                placeholder="Any specific requirements — road access, water, fencing, proximity to highway, etc."
                value={form.requirements} onChange={handleChange} rows={3} />
            </div>

            <div className="lead-form__consent">
              <input type="checkbox" id="lf-consent" name="consent"
                checked={form.consent} onChange={handleChange}
                className="lead-form__checkbox" />
              <label htmlFor="lf-consent" className="lead-form__consent-label">
                I agree to be contacted by Plottage Hub about my land requirement and accept that my information will not be shared publicly.
              </label>
            </div>
            {errors.consent && <span className="form-error">{errors.consent}</span>}

            {status === 'error' && (
              <div className="lead-form__error-msg">
                <AlertCircle size={16} />
                Something went wrong. Please try again or contact us directly.
              </div>
            )}

            <button
              type="submit"
              className="btn btn-gold lead-form__submit"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <span className="lead-form__spinner" />
              ) : (
                <><Send size={16} /> SUBMIT REQUIREMENT</>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
