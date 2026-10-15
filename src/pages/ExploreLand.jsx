import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Ruler, IndianRupee, Eye, MessageSquare, SlidersHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import './ExploreLand.css'

const DEMO_PROPERTIES = [
  { id: 'd1', title: 'Agricultural Land — Karjat', location: 'Karjat, Raigad', type: 'Agricultural', area: '5', unit: 'Acres', price: '₹45–55L', image: '/assets/property-agri.jpg', infra: ['Road access', 'River frontage'] },
  { id: 'd2', title: 'Residential Plot — Lonavala', location: 'Lonavala, Pune', type: 'Residential', area: '2,400', unit: 'Sq.ft', price: '₹18–24L', image: '/assets/property-residential.jpg', infra: ['Internal roads', 'Electricity'] },
  { id: 'd3', title: 'Coastal Land — Alibaug', location: 'Alibaug, Raigad', type: 'Farmhouse', area: '15', unit: 'Guntha', price: '₹35–50L', image: '/assets/alibaug.jpg', infra: ['Coastal road', 'Sea view'] },
  { id: 'd4', title: 'Agricultural Land — Karjat Hills', location: 'Karjat, Raigad', type: 'Agricultural', area: '8', unit: 'Acres', price: '₹60–75L', image: '/assets/karjat.jpg', infra: ['Highway access', 'Water source'] },
  { id: 'd5', title: 'Investment Plot — Panvel Corridor', location: 'Panvel, Raigad', type: 'Investment', area: '1,200', unit: 'Sq.ft', price: '₹12–16L', image: '/assets/panvel.jpg', infra: ['Metro vicinity', 'Clear title'] },
  { id: 'd6', title: 'Farmhouse Land — Lonavala View', location: 'Lonavala, Pune', type: 'Farmhouse', area: '20', unit: 'Guntha', price: '₹80–1.2Cr', image: '/assets/lonavala.jpg', infra: ['Valley view', 'Road access'] },
]

const types = ['All', 'Agricultural', 'Residential', 'Commercial', 'Investment', 'Farmhouse', 'Development']
const locationOpts = ['All', 'Lonavala', 'Karjat', 'Alibaug', 'Panvel', 'Khopoli', 'Pali']
const sortOpts = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'area-asc', label: 'Area: Small to Large' },
]

export default function ExploreLand() {
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [sort, setSort] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = DEMO_PROPERTIES.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase())
    const matchType = selectedType === 'All' || p.type === selectedType
    const matchLoc = selectedLocation === 'All' || p.location.includes(selectedLocation)
    return matchSearch && matchType && matchLoc
  })

  return (
    <div className="explore">
      {/* ── Hero ─────────────────────── */}
      <div className="explore__hero">
        <div className="container explore__hero-content">
          <motion.h1 className="explore__title" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            EXPLORE LAND
          </motion.h1>
          <motion.p className="explore__subtitle" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            Discover land opportunities across Maharashtra's most sought-after locations.
          </motion.p>
          {/* Search bar */}
          <motion.div className="explore__search-wrap" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Search size={18} className="explore__search-icon" />
            <input
              type="search"
              className="explore__search-input"
              placeholder="Search by location, property type..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search properties"
            />
            <button className="explore__filter-btn" onClick={() => setShowFilters(v => !v)} aria-label="Toggle filters">
              <SlidersHorizontal size={16} /> Filters
            </button>
          </motion.div>
        </div>
      </div>

      <div className="container explore__body">
        {/* Filters row */}
        <div className={`explore__filters ${showFilters ? 'explore__filters--open' : ''}`}>
          <div className="explore__filter-group">
            <label className="explore__filter-label">Property Type</label>
            <div className="explore__filter-pills">
              {types.map(t => (
                <button key={t} className={`explore__pill ${selectedType === t ? 'explore__pill--active' : ''}`}
                  onClick={() => setSelectedType(t)}>{t}</button>
              ))}
            </div>
          </div>
          <div className="explore__filter-group">
            <label className="explore__filter-label">Location</label>
            <select className="form-select" style={{ width: 'auto', minWidth: 160 }} value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
              {locationOpts.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="explore__filter-group" style={{ marginLeft: 'auto' }}>
            <label className="explore__filter-label">Sort By</label>
            <select className="form-select" style={{ width: 'auto', minWidth: 180 }} value={sort} onChange={e => setSort(e.target.value)}>
              {sortOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Demo notice */}
        <p className="explore__demo-note">⚠ Demonstration data — not verified live inventory</p>

        {/* Results */}
        <div className="explore__results-header">
          <span className="explore__results-count">{filtered.length} properties found</span>
        </div>

        {filtered.length === 0 ? (
          <div className="explore__empty">
            <p>No properties match your filters. Try adjusting your search.</p>
            <button className="btn btn-outline" onClick={() => { setSearch(''); setSelectedType('All'); setSelectedLocation('All'); }}>Clear Filters</button>
          </div>
        ) : (
          <div className="explore__grid">
            {filtered.map((prop, i) => (
              <motion.div key={prop.id} className="prop-card"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
              >
                <div className="prop-card__image-wrap">
                  <img src={prop.image} alt={prop.title} className="prop-card__image" loading="lazy" />
                  <div className="prop-card__image-overlay" />
                  <div className="prop-card__badges">
                    <span className="badge badge-gold">{prop.type}</span>
                    <span className="badge" style={{ background: 'rgba(192,57,43,0.18)', color: '#C0392B', border: '1px solid rgba(192,57,43,0.25)', fontSize: '9px' }}>DEMO</span>
                  </div>
                </div>
                <div className="prop-card__body">
                  <h3 className="prop-card__title">{prop.title}</h3>
                  <div className="prop-card__location"><MapPin size={12} /><span>{prop.location}</span></div>
                  <div className="prop-card__meta">
                    <div className="prop-card__meta-item"><Ruler size={13} /><span>{prop.area} {prop.unit}</span></div>
                    <div className="prop-card__price"><IndianRupee size={13} /><span>{prop.price}</span></div>
                  </div>
                  <div className="prop-card__infra">
                    {prop.infra.map(inf => <span key={inf} className="prop-card__infra-tag">{inf}</span>)}
                  </div>
                  <div className="prop-card__actions">
                    <Link to={`/property/${prop.id}`} className="btn btn-gold prop-card__view"><Eye size={14} /> View</Link>
                    <Link to={`/property/${prop.id}#enquire`} className="btn btn-outline prop-card__enquire"><MessageSquare size={14} /> Enquire</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
