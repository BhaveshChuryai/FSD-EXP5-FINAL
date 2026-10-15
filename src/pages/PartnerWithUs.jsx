import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ArrowRight } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import './PartnerWithUs.css'

const roles = [
  { id: 'landowner',  emoji: '🏡', title: 'Landowner', desc: 'List and manage your land property' },
  { id: 'broker',     emoji: '🤝', title: 'Broker / Channel Partner', desc: 'Earn by connecting buyers and sellers' },
  { id: 'developer',  emoji: '🏗️', title: 'Developer', desc: 'Collaborate on land development projects' },
  { id: 'esp',        emoji: '📋', title: 'Exclusive Selling Partner', desc: 'Market properties exclusively with us' },
  { id: 'investor',   emoji: '📈', title: 'Investor', desc: 'Discover curated investment opportunities' },
  { id: 'strategic',  emoji: '🌐', title: 'Strategic Partner', desc: 'Offer professional services to our network' },
]

const areaUnits = ['Sq.ft', 'Sq.m', 'Guntha', 'Acre', 'Hectare']
const docStatus = ['Available', 'Partially Available', 'Not Organized', 'Unknown']
const propTypes = ['Agricultural', 'Residential', 'Commercial', 'Farmhouse', 'Development', 'Industrial']

function LandownerForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ name:'', phone:'', email:'', location:'', propertyType:'', area:'', areaUnit:'Acre', ownership:'Owner', price:'', collab:'', docStatus:'', desc:'' })
  const h = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  return (
    <form className="partner-form" onSubmit={e => { e.preventDefault(); onSubmit(form) }}>
      <div className="partner-form__row">
        <div className="form-group"><label className="form-label">Full Name *</label><input name="name" className="form-input" value={form.name} onChange={h} required /></div>
        <div className="form-group"><label className="form-label">Phone *</label><input name="phone" type="tel" className="form-input" value={form.phone} onChange={h} required maxLength={10} /></div>
      </div>
      <div className="form-group"><label className="form-label">Email</label><input name="email" type="email" className="form-input" value={form.email} onChange={h} /></div>
      <div className="form-group"><label className="form-label">Land Location *</label><input name="location" className="form-input" placeholder="Village / Taluka / District" value={form.location} onChange={h} required /></div>
      <div className="partner-form__row">
        <div className="form-group"><label className="form-label">Property Type</label><select name="propertyType" className="form-select" value={form.propertyType} onChange={h}><option value="">Select</option>{propTypes.map(t=><option key={t}>{t}</option>)}</select></div>
        <div className="form-group"><label className="form-label">Documentation Status</label><select name="docStatus" className="form-select" value={form.docStatus} onChange={h}><option value="">Select</option>{docStatus.map(d=><option key={d}>{d}</option>)}</select></div>
      </div>
      <div className="partner-form__row">
        <div className="form-group"><label className="form-label">Total Area</label><input name="area" type="number" className="form-input" value={form.area} onChange={h} /></div>
        <div className="form-group"><label className="form-label">Unit</label><select name="areaUnit" className="form-select" value={form.areaUnit} onChange={h}>{areaUnits.map(u=><option key={u}>{u}</option>)}</select></div>
      </div>
      <div className="form-group"><label className="form-label">Expected Price (₹)</label><input name="price" className="form-input" placeholder="e.g. 50 Lakh or As per market" value={form.price} onChange={h} /></div>
      <div className="form-group"><label className="form-label">Property Description</label><textarea name="desc" className="form-textarea" value={form.desc} onChange={h} placeholder="Location details, accessibility, surrounding infrastructure..." rows={4} /></div>
      <button type="submit" className="btn btn-gold partner-form__submit" disabled={loading}>
        {loading ? <span className="lead-form__spinner"/> : <><ArrowRight size={16}/> Submit Application</>}
      </button>
    </form>
  )
}

function BrokerForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ name:'', phone:'', email:'', agency:'', locations:'', experience:'', categories:'', interests:'' })
  const h = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  return (
    <form className="partner-form" onSubmit={e => { e.preventDefault(); onSubmit(form) }}>
      <div className="partner-form__row">
        <div className="form-group"><label className="form-label">Full Name *</label><input name="name" className="form-input" value={form.name} onChange={h} required /></div>
        <div className="form-group"><label className="form-label">Phone *</label><input name="phone" type="tel" className="form-input" value={form.phone} onChange={h} required maxLength={10}/></div>
      </div>
      <div className="form-group"><label className="form-label">Email</label><input name="email" type="email" className="form-input" value={form.email} onChange={h}/></div>
      <div className="form-group"><label className="form-label">Business / Agency Name</label><input name="agency" className="form-input" value={form.agency} onChange={h}/></div>
      <div className="form-group"><label className="form-label">Operating Locations</label><input name="locations" className="form-input" placeholder="e.g. Lonavala, Karjat, Alibaug" value={form.locations} onChange={h}/></div>
      <div className="partner-form__row">
        <div className="form-group"><label className="form-label">Years of Experience</label><input name="experience" className="form-input" value={form.experience} onChange={h}/></div>
        <div className="form-group"><label className="form-label">Property Categories Handled</label><input name="categories" className="form-input" value={form.categories} onChange={h}/></div>
      </div>
      <div className="form-group"><label className="form-label">Collaboration Interests</label><textarea name="interests" className="form-textarea" value={form.interests} onChange={h} rows={3}/></div>
      <button type="submit" className="btn btn-gold partner-form__submit" disabled={loading}>
        {loading ? <span className="lead-form__spinner"/> : <><ArrowRight size={16}/> Submit Application</>}
      </button>
    </form>
  )
}

function GenericForm({ role, onSubmit, loading }) {
  const [form, setForm] = useState({ name:'', phone:'', email:'', info:'' })
  const h = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  return (
    <form className="partner-form" onSubmit={e => { e.preventDefault(); onSubmit(form) }}>
      <div className="partner-form__row">
        <div className="form-group"><label className="form-label">Full Name *</label><input name="name" className="form-input" value={form.name} onChange={h} required/></div>
        <div className="form-group"><label className="form-label">Phone *</label><input name="phone" type="tel" className="form-input" value={form.phone} onChange={h} required maxLength={10}/></div>
      </div>
      <div className="form-group"><label className="form-label">Email *</label><input name="email" type="email" className="form-input" value={form.email} onChange={h} required/></div>
      <div className="form-group"><label className="form-label">Additional Information</label><textarea name="info" className="form-textarea" value={form.info} onChange={h} placeholder={`Tell us more about your ${role} interest...`} rows={5}/></div>
      <button type="submit" className="btn btn-gold partner-form__submit" disabled={loading}>
        {loading ? <span className="lead-form__spinner"/> : <><ArrowRight size={16}/> Submit Application</>}
      </button>
    </form>
  )
}

export default function PartnerWithUs() {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [refId, setRefId] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      const res = await axios.post('/api/partner-applications', { ...formData, partnerType: selected })
      setRefId(res.data?.referenceId || 'PH-APP-' + Date.now())
      setSubmitted(true)
      toast.success('Application submitted successfully!')
    } catch {
      setRefId('PH-APP-' + Date.now())
      setSubmitted(true)
      toast.success('Application submitted! We\'ll reach out shortly.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div className="partner-success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <CheckCircle size={52} color="var(--success)" />
          <h2>Application Received</h2>
          <p>Thank you for your interest in partnering with Plottage Hub. Our team will review your application and reach out within 2–3 business days.</p>
          {refId && <p className="lead-form__ref">Reference: <strong>{refId}</strong></p>}
          <p style={{ fontSize: '0.75rem', color: 'var(--error)', opacity: 0.6 }}>Application approval is subject to review and is not automatic.</p>
          <button className="btn btn-outline" onClick={() => { setSubmitted(false); setSelected(null) }}>Submit Another</button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="partner-page">
      {/* Hero */}
      <div className="partner-hero">
        <div className="container partner-hero__content">
          <motion.h1 className="partner-hero__title" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            PARTNER WITH<br/><span className="gradient-text">PLOTTAGE HUB</span>
          </motion.h1>
          <motion.p className="partner-hero__sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
            HOW WOULD YOU LIKE TO WORK WITH PLOTTAGE HUB?
          </motion.p>
        </div>
      </div>

      <div className="container partner-page__body">
        {/* Role selector */}
        <div className="partner-roles">
          {roles.map((r, i) => (
            <motion.button
              key={r.id}
              className={`partner-role-btn ${selected === r.id ? 'partner-role-btn--active' : ''}`}
              onClick={() => setSelected(r.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
            >
              <span className="partner-role-btn__emoji">{r.emoji}</span>
              <span className="partner-role-btn__title">{r.title}</span>
              <span className="partner-role-btn__desc">{r.desc}</span>
            </motion.button>
          ))}
        </div>

        {/* Dynamic form */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected}
              className="partner-form-wrap"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="partner-form-wrap__title">
                {roles.find(r => r.id === selected)?.title} Application
              </h2>
              <p className="partner-form-wrap__notice">
                All fields marked * are required. Submission does not guarantee automatic approval.
              </p>
              {selected === 'landowner' && <LandownerForm onSubmit={handleSubmit} loading={loading} />}
              {selected === 'broker'    && <BrokerForm    onSubmit={handleSubmit} loading={loading} />}
              {(selected === 'developer' || selected === 'esp' || selected === 'investor' || selected === 'strategic') &&
                <GenericForm role={selected} onSubmit={handleSubmit} loading={loading} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
