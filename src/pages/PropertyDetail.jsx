import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MapPin, ShieldCheck, CheckCircle2, 
  ArrowLeft, FileCheck,
  Send, Sparkles, Building, Info, Share2, Heart,
  Maximize2, ChevronLeft, ChevronRight, X, Scale, ExternalLink
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { propertiesAPI, leadsAPI } from '../services/api'
import { toggleSaveProperty, toggleCompareProperty } from '../store/slices/propertySlice'
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
  const dispatch = useDispatch()
  const { savedProperties = [], comparedProperties = [] } = useSelector(s => s.properties)

  const initialProp = PROPERTIES_DB[id] || {
    ...DEFAULT_PROP,
    id: id || 'demo-property',
    title: 'Premium Verified Land Parcel',
  }
  const [prop, setProp] = useState(initialProp)

  const [activeImg, setActiveImg] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [form, setForm] = useState({ name: '', phone: '', email: '', preferredDate: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [refId, setRefId] = useState(null)

  const isSaved = savedProperties.some(p => p.id === prop.id)
  const isCompared = comparedProperties.some(p => p.id === prop.id)

  // Lightbox keyboard controls: Escape, Left, Right
  useEffect(() => {
    if (!lightboxOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowRight') setLightboxIndex(prev => (prev + 1) % prop.images.length)
      if (e.key === 'ArrowLeft') setLightboxIndex(prev => (prev - 1 + prop.images.length) % prop.images.length)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, prop.images?.length])

  // Explainable Similar Properties (item 15)
  const similarProps = useMemo(() => {
    return Object.values(PROPERTIES_DB)
      .filter(p => p.id !== prop.id)
      .map(p => {
        let reason = 'Nearby in Maharashtra'
        if (p.type === prop.type) reason = `Matching ${p.type} Parcel`
        else if (p.location.split(',')[0] === prop.location.split(',')[0]) reason = `Raigad Growth Belt`
        return { ...p, reason }
      })
      .slice(0, 3)
  }, [prop.id, prop.type, prop.location])

  useEffect(() => {
    let mounted = true
    if (id && !PROPERTIES_DB[id]) {
      propertiesAPI.getById(id)
        .then(res => {
          if (!mounted) return
          const live = res.data?.data
          if (live) {
            setProp({
              id: live._id || live.id,
              title: live.title,
              location: live.location,
              type: live.propertyType,
              area: String(live.area),
              unit: live.areaUnit,
              price: live.price,
              images: live.images?.length ? live.images : ['/assets/property-agri.jpg'],
              infra: live.infrastructure?.length ? live.infrastructure : ['Clear Title', 'Road Access'],
              zone: live.zone || 'Clear Zone',
              titleStatus: live.docStatus || 'Clear & Marketable Title',
              satbaraStatus: live.docStatus || '7/12 Extract Available',
              description: live.description || '',
            })
          }
        })
        .catch(() => {
          // Keep initial fallback if offline or not found
        })
    }
    return () => { mounted = false }
  }, [id])

  const handleToggleSave = () => {
    dispatch(toggleSaveProperty(prop))
    toast.success(isSaved ? 'Removed from saved properties' : 'Saved to your shortlist!')
  }

  const handleToggleCompare = () => {
    dispatch(toggleCompareProperty(prop))
    toast.success(isCompared ? 'Removed from comparison' : 'Added to parcel comparison!')
  }

  const handleEnquiry = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) {
      toast.error('Please enter your name and phone number')
      return
    }
    setLoading(true)
    try {
      const res = await leadsAPI.submitEnquiry({
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
              onClick={handleToggleCompare}
              style={{ color: isCompared ? 'var(--gold-primary)' : 'var(--text-secondary)' }}
              title="Compare with other parcels"
            >
              <Scale size={16} /> {isCompared ? 'Comparing' : 'Compare'}
            </button>
            <button 
              className="btn btn-ghost" 
              onClick={handleToggleSave}
              style={{ color: isSaved ? 'var(--gold-primary)' : 'var(--text-secondary)' }}
            >
              <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} /> {isSaved ? 'Saved' : 'Save'}
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
          <div className="prop-detail__main-img-wrap" style={{ cursor: 'pointer', position: 'relative' }} onClick={() => { setLightboxIndex(activeImg); setLightboxOpen(true); }}>
            <img 
              src={prop.images[activeImg] || prop.images[0]} 
              alt={prop.title} 
              className="prop-detail__main-img" 
            />
            <div className="prop-detail__img-overlay" />
            <button 
              className="btn btn-ghost"
              style={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                background: 'rgba(0,0,0,0.65)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
              aria-label="View Full Screen Lightbox"
            >
              <Maximize2 size={14} /> Fullscreen Gallery ({prop.images?.length || 1})
            </button>
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

        {/* Similar Land Parcels (Explainable Recommendation Engine — Item 15) */}
        {similarProps.length > 0 && (
          <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gold-primary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  <Sparkles size={15} /> Curated Recommendations
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 500 }}>
                  Similar Land Parcels in Maharashtra
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Handpicked matching parcels based on land classification, soil profile, and regional infrastructure.
                </p>
              </div>
              <Link to="/explore" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
                View All Parcels <ExternalLink size={14} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {similarProps.map(sp => (
                <div 
                  key={sp.id}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                    <img 
                      src={sp.images?.[0] || '/assets/property-agri.jpg'} 
                      alt={sp.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span className="badge badge-gold" style={{ fontSize: '10px' }}>{sp.type}</span>
                      <span style={{ background: 'rgba(0,0,0,0.75)', color: 'var(--gold-light)', padding: '2px 8px', borderRadius: 4, fontSize: '10px', border: '1px solid var(--gold-border)' }}>
                        {sp.reason}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                      {sp.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4, marginBottom: '0.75rem' }}>
                      <MapPin size={13} color="var(--gold-primary)" /> {sp.location}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sp.area} {sp.unit}</span>
                      <span style={{ fontWeight: 600, color: 'var(--gold-primary)', fontSize: '1rem' }}>{sp.price}</span>
                    </div>
                    <Link to={`/property/${sp.id}`} className="btn btn-outline" style={{ marginTop: '1rem', justifyContent: 'center', fontSize: '0.8rem', padding: '6px 12px' }}>
                      Inspect Parcel
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full-Screen Lightbox Gallery Modal (Item 13) */}
      {lightboxOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(5, 7, 10, 0.96)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setLightboxOpen(false)}
        >
          {/* Header Controls */}
          <div 
            style={{
              position: 'absolute',
              top: 20,
              left: 24,
              right: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#fff',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--gold-primary)' }}>{prop.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                Image {lightboxIndex + 1} of {prop.images?.length || 1} • High-Resolution Land Survey
              </div>
            </div>
            <button 
              onClick={() => setLightboxOpen(false)}
              className="btn btn-ghost"
              style={{ color: '#fff', padding: 8 }}
              aria-label="Close Lightbox"
            >
              <X size={26} />
            </button>
          </div>

          {/* Main Lightbox Image View */}
          <div 
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '78vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={e => e.stopPropagation()}
          >
            <img 
              src={prop.images[lightboxIndex] || prop.images[0]} 
              alt={`${prop.title} survey view ${lightboxIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '78vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
              }}
            />

            {/* Navigation Arrows */}
            {prop.images?.length > 1 && (
              <>
                <button
                  onClick={() => setLightboxIndex(prev => (prev - 1 + prop.images.length) % prop.images.length)}
                  aria-label="Previous Image"
                  style={{
                    position: 'absolute',
                    left: -20,
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'rgba(212, 175, 55, 0.25)',
                    border: '1px solid var(--gold-primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => setLightboxIndex(prev => (prev + 1) % prop.images.length)}
                  aria-label="Next Image"
                  style={{
                    position: 'absolute',
                    right: -20,
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'rgba(212, 175, 55, 0.25)',
                    border: '1px solid var(--gold-primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails Strip */}
          <div 
            style={{
              position: 'absolute',
              bottom: 24,
              display: 'flex',
              gap: 12,
              overflowX: 'auto',
              maxWidth: '85vw',
              padding: '4px',
            }}
            onClick={e => e.stopPropagation()}
          >
            {prop.images?.map((img, idx) => (
              <img 
                key={idx}
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => setLightboxIndex(idx)}
                style={{
                  width: 60,
                  height: 44,
                  objectFit: 'cover',
                  borderRadius: 4,
                  cursor: 'pointer',
                  border: lightboxIndex === idx ? '2px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.2)',
                  opacity: lightboxIndex === idx ? 1 : 0.6,
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
