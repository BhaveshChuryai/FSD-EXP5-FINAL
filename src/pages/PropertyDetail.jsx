import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MapPin, ShieldCheck, CheckCircle2, 
  ArrowLeft, FileCheck,
  Send, Sparkles, Building, Info, Share2, Heart
} from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import './PropertyDetail.css'

const PROPERTIES_DB = {
  'd1': {
    id: 'd1',
    title: 'Agricultural Land — Karjat Riverside',
    location: 'Karjat, Raigad, Maharashtra',
    type: 'Agricultural',
    area: '5',
    unit: 'Acres',
    price: '₹45–55 Lakh',
    images: ['/assets/property-agri.jpg', '/assets/karjat.jpg', '/assets/lonavala.jpg'],
    infra: ['Direct Tar Road Access', 'Natural River Frontage', '3-Phase Electric Line', 'Perennial Water Source'],
    zone: 'Green Zone / Agri',
    titleStatus: 'Clear & Marketable Title',
    satbaraStatus: 'Single Owner 7/12 Extract Verified',
    description: 'Scenic fertile agricultural land situated along the riverbank in Karjat. Ideal for organic farming, wellness retreat, private estate, or agro-tourism project with immediate road connectivity and water availability all year round.'
  },
  'd2': {
    id: 'd2',
    title: 'Residential Plot — Lonavala Foothills',
    location: 'Lonavala, Pune, Maharashtra',
    type: 'Residential',
    area: '2,400',
    unit: 'Sq.ft',
    price: '₹18–24 Lakh',
    images: ['/assets/property-residential.jpg', '/assets/lonavala.jpg', '/assets/panvel.jpg'],
    infra: ['Internal 9m Paved Roads', 'Underground Electricity', 'Gated Boundary Wall', 'Water Pipeline Connection'],
    zone: 'Residential NA / Sanctioned Layout',
    titleStatus: 'Collector NA Approved',
    satbaraStatus: 'Separate 7/12 Extract Ready',
    description: 'Exclusive residential plot in a gated sanctuary overlooking the misty hills of Lonavala. Complete with modern internal infrastructure, secure demarcations, and swift access to the Mumbai-Pune Expressway.'
  },
  'd3': {
    id: 'd3',
    title: 'Coastal Farmhouse Land — Alibaug',
    location: 'Alibaug, Raigad, Maharashtra',
    type: 'Farmhouse',
    area: '15',
    unit: 'Guntha',
    price: '₹35–50 Lakh',
    images: ['/assets/alibaug.jpg', '/assets/property-agri.jpg', '/assets/karjat.jpg'],
    infra: ['Coastal Highway Connectivity', 'High Yield Sweet Water Well', 'Fenced Boundary', 'Coconut & Mango Groves'],
    zone: 'Coastal Regulation Compliant Farmhouse',
    titleStatus: 'Inheritance Clear Title',
    satbaraStatus: 'Updated Mutation Entries (6-D)',
    description: 'Serene coastal paradise located just 20 minutes from Mandwa Jetty in Alibaug. Surrounded by lush flora with sea breezes, perfect for a signature second home, private luxury villa, or boutique weekend rental.'
  },
  'd4': {
    id: 'd4',
    title: 'Agricultural Land — Karjat Hills',
    location: 'Karjat, Raigad, Maharashtra',
    type: 'Agricultural',
    area: '8',
    unit: 'Acres',
    price: '₹60–75 Lakh',
    images: ['/assets/karjat.jpg', '/assets/property-agri.jpg', '/assets/lonavala.jpg'],
    infra: ['Highway Access 500m', 'Mountain Stream View', 'Borewell Dug', 'Transformer Nearby'],
    zone: 'Agri / Farmhouse Feasible',
    titleStatus: 'Single Family Owned Clear Title',
    satbaraStatus: 'Zero Encumbrance Certificate',
    description: 'High-elevation mountain-facing land parcel in Karjat. Unobstructed valley views, rich soil composition, and immense potential for eco-resort development or high-value horticulture.'
  },
  'd5': {
    id: 'd5',
    title: 'Investment Plot — Panvel Growth Corridor',
    location: 'Panvel, Raigad, Maharashtra',
    type: 'Investment',
    area: '1,200',
    unit: 'Sq.ft',
    price: '₹12–16 Lakh',
    images: ['/assets/panvel.jpg', '/assets/property-residential.jpg', '/assets/karjat.jpg'],
    infra: ['Proposed Ring Road Touch', 'Rapid Metro Vicinity', 'Street Lights Installed', 'Clear Demarcation'],
    zone: 'Growth Center / Semi-Urban',
    titleStatus: 'CIDCO NA In Process / Clear Title',
    satbaraStatus: 'Clean Land Records',
    description: 'High capital appreciation opportunity adjacent to the Navi Mumbai International Airport corridor and upcoming multimodal transport hub. Exceptional returns forecasted over a 3-5 year horizon.'
  },
  'd6': {
    id: 'd6',
    title: 'Farmhouse Land — Lonavala View',
    location: 'Lonavala, Pune, Maharashtra',
    type: 'Farmhouse',
    area: '20',
    unit: 'Guntha',
    price: '₹80–1.2 Cr',
    images: ['/assets/lonavala.jpg', '/assets/alibaug.jpg', '/assets/property-residential.jpg'],
    infra: ['Private Concrete Driveway', 'Mountain Cliff Edge', 'Dual Water Source', 'High-speed Fiber Optic Area'],
    zone: 'Hill Station Farmhouse Zone',
    titleStatus: 'Direct Owner Clear Title',
    satbaraStatus: 'Digitized 7/12 With Zero Liens',
    description: 'Super-prime luxury parcel at peak elevation in Lonavala. 360-degree panoramic vista over the Western Ghats waterfalls and fog-kissed valleys. A trophy acquisition for discerning high-net-worth investors.'
  }
}

// Fallback for any id
const DEFAULT_PROP = PROPERTIES_DB['d1']

function createRefId() {
  return `ENQ-${Date.now().toString().slice(-6)}`
}

export default function PropertyDetail() {
  const { id } = useParams()
  const prop = PROPERTIES_DB[id] || {
    ...DEFAULT_PROP,
    id: id || 'demo-property',
    title: 'Premium Verified Land Parcel',
  }

  const [activeImg, setActiveImg] = useState(0)
  const [form, setForm] = useState({ name: '', phone: '', email: '', preferredDate: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [refId, setRefId] = useState(null)
  const [saved, setSaved] = useState(false)

  const handleEnquiry = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) {
      toast.error('Please enter your name and phone number')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post('/api/enquiries', {
        ...form,
        propertyId: prop.id,
        propertyTitle: prop.title,
        propertyLocation: prop.location,
      })
      setRefId(res.data?.referenceId || createRefId())
      toast.success('Site visit enquiry submitted successfully!')
    } catch {
      setRefId(createRefId())
      toast.success('Enquiry registered! Our local land manager will call you.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="prop-detail">
      {/* Top Bar */}
      <div className="prop-detail__header-bar">
        <div className="container prop-detail__nav">
          <Link to="/explore" className="prop-detail__back">
            <ArrowLeft size={16} /> Back to Land Discovery
          </Link>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button 
              className="btn btn-ghost" 
              onClick={() => {
                setSaved(!saved)
                toast.success(saved ? 'Removed from saved properties' : 'Saved to your dashboard!')
              }}
              style={{ color: saved ? 'var(--gold-primary)' : 'var(--text-secondary)' }}
            >
              <Heart size={16} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}
            </button>
            <button 
              className="btn btn-ghost" 
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href)
                  toast.success('Property link copied to clipboard!')
                }
              }}
            >
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Images Grid */}
        <motion.div 
          className="prop-detail__hero-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="prop-detail__main-img-wrap">
            <img 
              src={prop.images[activeImg] || prop.images[0]} 
              alt={prop.title} 
              className="prop-detail__main-img" 
            />
            <div className="prop-detail__img-overlay" />
          </div>
          <div className="prop-detail__side-imgs">
            {prop.images.map((img, i) => (
              <div 
                key={i} 
                className="prop-detail__sub-img-wrap"
                style={{ 
                  borderColor: activeImg === i ? 'var(--gold-primary)' : 'var(--border-subtle)',
                  opacity: activeImg === i ? 1 : 0.7 
                }}
                onClick={() => setActiveImg(i)}
              >
                <img src={img} alt={`${prop.title} view ${i + 1}`} className="prop-detail__sub-img" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Content & Sticky Sidebar */}
        <div className="prop-detail__layout">
          {/* Main Info */}
          <div className="prop-detail__content">
            <div className="prop-detail__title-section">
              <div className="prop-detail__badges">
                <span className="badge badge-gold">{prop.type}</span>
                <span className="badge badge-outline"><ShieldCheck size={12} /> {prop.titleStatus}</span>
                <span className="badge" style={{ background: 'rgba(192,57,43,0.18)', color: '#C0392B', border: '1px solid rgba(192,57,43,0.3)', fontSize: '10px' }}>
                  DEMO LISTING
                </span>
              </div>
              <h1 className="prop-detail__title">{prop.title}</h1>
              <div className="prop-detail__location">
                <MapPin size={16} color="var(--gold-primary)" />
                <span>{prop.location}</span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="prop-detail__stats">
              <div className="prop-detail__stat-card">
                <div className="prop-detail__stat-label">Total Land Area</div>
                <div className="prop-detail__stat-val">{prop.area} {prop.unit}</div>
              </div>
              <div className="prop-detail__stat-card">
                <div className="prop-detail__stat-label">Price Bracket</div>
                <div className="prop-detail__stat-val">{prop.price}</div>
              </div>
              <div className="prop-detail__stat-card">
                <div className="prop-detail__stat-label">Zoning Classification</div>
                <div className="prop-detail__stat-val" style={{ fontSize: '1rem' }}>{prop.zone}</div>
              </div>
              <div className="prop-detail__stat-card">
                <div className="prop-detail__stat-label">State</div>
                <div className="prop-detail__stat-val">Maharashtra</div>
              </div>
            </div>

            {/* Description */}
            <div className="prop-detail__card">
              <h2 className="prop-detail__card-title"><Building size={18} /> Property Overview</h2>
              <p className="prop-detail__desc">{prop.description}</p>
            </div>

            {/* Key Infrastructure & Highlights */}
            <div className="prop-detail__card">
              <h2 className="prop-detail__card-title"><Sparkles size={18} /> Infrastructure & Access</h2>
              <div className="prop-detail__highlights">
                {prop.infra.map(item => (
                  <div key={item} className="prop-detail__highlight-item">
                    <CheckCircle2 size={16} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Verification Due Diligence */}
            <div className="prop-detail__card">
              <h2 className="prop-detail__card-title"><FileCheck size={18} /> Due Diligence Status</h2>
              <div style={{ display: 'grid', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                  <ShieldCheck size={18} color="var(--success)" />
                  <span><strong>7/12 Extract:</strong> {prop.satbaraStatus}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                  <ShieldCheck size={18} color="var(--success)" />
                  <span><strong>Legal Title:</strong> Clear search report conducted for 30 years</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                  <ShieldCheck size={18} color="var(--success)" />
                  <span><strong>Physical Demarcation:</strong> Boundaries surveyed with GPS coordinates</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Enquiry Sidebar */}
          <aside className="prop-detail__sidebar" id="enquire">
            <div className="prop-detail__price-wrap">
              <div className="prop-detail__price-label">Quoted Price Range</div>
              <div className="prop-detail__price-num">{prop.price}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                * Excludes stamp duty & registration charges
              </div>
            </div>

            {refId ? (
              <div className="prop-detail__ref-box">
                <CheckCircle2 size={36} color="var(--success)" style={{ margin: '0 auto 0.75rem' }} />
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Site Visit Requested!</h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  Our Maharashtra land coordinator will connect with you within 4 hours.
                </p>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--gold-primary)', fontWeight: 600 }}>
                  {refId}
                </div>
                <button 
                  className="btn btn-outline" 
                  style={{ marginTop: '1rem', width: '100%' }}
                  onClick={() => setRefId(null)}
                >
                  Book Another Visit
                </button>
              </div>
            ) : (
              <form className="prop-detail__form" onSubmit={handleEnquiry}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.25rem' }}>Schedule Site Visit</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Inspect this property in person with our verified local field specialist.
                </p>

                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Enter your name"
                    value={form.name} 
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={form.phone} 
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email (Optional)</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="name@example.com"
                    value={form.email} 
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={form.preferredDate} 
                    onChange={e => setForm(f => ({ ...f, preferredDate: e.target.value }))}
                  />
                </div>

                <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                  {loading ? 'Submitting...' : <><Send size={15} /> Request Site Visit</>}
                </button>
              </form>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <Info size={14} style={{ flexShrink: 0 }} />
              <span>Zero brokerage fees for genuine land discovery on Plottage Hub</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
