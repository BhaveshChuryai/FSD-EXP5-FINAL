import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, MapPin, Ruler, IndianRupee, Eye, MessageSquare, 
  SlidersHorizontal, Heart, CheckCircle2, RotateCcw, Sparkles 
} from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { propertiesAPI } from '../services/api'
import './ExploreLand.css'

const DEMO_PROPERTIES = [
  {
    id: 'd1',
    title: 'Agricultural Land — Karjat Riverside',
    location: 'Karjat, Raigad',
    type: 'Agricultural',
    area: '5',
    unit: 'Acres',
    acreEquivalent: 5.0,
    price: '₹45–55 Lakh',
    minPriceLakh: 45,
    maxPriceLakh: 55,
    image: '/assets/property-agri.jpg',
    infra: ['Tar Road Access', 'River Frontage', 'Electricity'],
    description: 'Scenic fertile agricultural land along the riverbank in Karjat. Ideal for organic farming, wellness retreat, or private estate.'
  },
  {
    id: 'd2',
    title: 'Residential Plot — Lonavala Foothills',
    location: 'Lonavala, Pune',
    type: 'Residential',
    area: '2,400',
    unit: 'Sq.ft',
    acreEquivalent: 0.055,
    price: '₹18–24 Lakh',
    minPriceLakh: 18,
    maxPriceLakh: 24,
    image: '/assets/property-residential.jpg',
    infra: ['Internal Roads', 'Sanctioned NA', 'Underground Power'],
    description: 'Exclusive residential plot in a gated sanctuary overlooking the misty hills of Lonavala with ready Collector NA sanction.'
  },
  {
    id: 'd3',
    title: 'Coastal Farmhouse Land — Alibaug',
    location: 'Alibaug, Raigad',
    type: 'Farmhouse',
    area: '15',
    unit: 'Guntha',
    acreEquivalent: 0.375,
    price: '₹35–50 Lakh',
    minPriceLakh: 35,
    maxPriceLakh: 50,
    image: '/assets/alibaug.jpg',
    infra: ['Coastal Highway', 'Sweet Water Well', 'Fenced Boundary'],
    description: 'Serene coastal paradise located 20 minutes from Mandwa Jetty in Alibaug. Surrounded by lush flora and cool sea breezes.'
  },
  {
    id: 'd4',
    title: 'Agricultural Land — Karjat Hills',
    location: 'Karjat, Raigad',
    type: 'Agricultural',
    area: '8',
    unit: 'Acres',
    acreEquivalent: 8.0,
    price: '₹60–75 Lakh',
    minPriceLakh: 60,
    maxPriceLakh: 75,
    image: '/assets/karjat.jpg',
    infra: ['Highway Access', 'Water Source', 'Single 7/12 Title'],
    description: 'Expansive hillside agricultural parcel capturing panoramic Sahyadri views, ideal for private farmhouses or horticulture.'
  },
  {
    id: 'd5',
    title: 'Investment Plot — Panvel Growth Corridor',
    location: 'Panvel, Raigad',
    type: 'Investment',
    area: '1,200',
    unit: 'Sq.ft',
    acreEquivalent: 0.027,
    price: '₹12–16 Lakh',
    minPriceLakh: 12,
    maxPriceLakh: 16,
    image: '/assets/panvel.jpg',
    infra: ['Metro Vicinity', 'Clear Title', 'High Appreciation'],
    description: 'High-growth potential land parcel located in the vicinity of the Navi Mumbai International Airport economic hub.'
  },
  {
    id: 'd6',
    title: 'Farmhouse Estate — Lonavala Valley',
    location: 'Lonavala, Pune',
    type: 'Farmhouse',
    area: '20',
    unit: 'Guntha',
    acreEquivalent: 0.5,
    price: '₹80 Lakh–1.2 Cr',
    minPriceLakh: 80,
    maxPriceLakh: 120,
    image: '/assets/lonavala.jpg',
    infra: ['Valley View', 'Private Road', 'Hilltop Plateau'],
    description: 'Premium table-land parcel capturing mist-filled cliff vistas in prime Lonavala, ready for bespoke architectural estate development.'
  },
]

const types = ['All', 'Agricultural', 'Residential', 'Commercial', 'Investment', 'Farmhouse', 'Development']
const locationOpts = ['All Locations', 'Karjat', 'Lonavala', 'Alibaug', 'Panvel', 'Khopoli', 'Pali']
const budgetOpts = [
  { value: 'all', label: 'All Budgets' },
  { value: 'under-25', label: 'Under ₹25 Lakh' },
  { value: '25-50', label: '₹25L – ₹50 Lakh' },
  { value: '50-100', label: '₹50L – ₹1 Crore' },
  { value: 'above-100', label: 'Above ₹1 Crore' },
]
const areaOpts = [
  { value: 'all', label: 'All Land Sizes' },
  { value: 'under-2', label: 'Under 2 Acres (< 80 Guntha)' },
  { value: '2-5', label: '2 – 5 Acres' },
  { value: '5-10', label: '5 – 10 Acres' },
  { value: 'above-10', label: '10+ Acres' },
]
const sortOpts = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'area-asc', label: 'Area: Small to Large' },
  { value: 'area-desc', label: 'Area: Large to Small' },
]

export default function ExploreLand() {
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All Locations')
  const [selectedBudget, setSelectedBudget] = useState('all')
  const [selectedArea, setSelectedArea] = useState('all')
  const [sort, setSort] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [properties, setProperties] = useState(DEMO_PROPERTIES)
  const [isLiveDB, setIsLiveDB] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    const fetchLiveProperties = async () => {
      setLoading(true)
      try {
        const res = await propertiesAPI.getAll({ limit: 50 })
        if (mounted && res.data?.data && res.data.data.length > 0) {
          const mapped = res.data.data.map(p => ({
            id: p._id || p.id,
            title: p.title,
            location: p.location,
            type: p.propertyType,
            area: String(p.area),
            unit: p.areaUnit,
            acreEquivalent: p.acreEquivalent || (p.areaUnit?.toLowerCase().includes('acre') ? Number(p.area) : 1),
            price: p.price,
            minPriceLakh: p.priceAmount || 30,
            maxPriceLakh: p.priceAmount || 60,
            image: (p.images && p.images[0]) || '/assets/property-agri.jpg',
            infra: p.infrastructure || [],
            description: p.description || '',
            isLiveRecord: true,
          }))
          setProperties(mapped)
          setIsLiveDB(true)
        }
      } catch {
        // Graceful fallback to demo properties
        setIsLiveDB(false)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchLiveProperties()
    return () => { mounted = false }
  }, [])
  
  // Local bookmarks state
  const [savedIds, setSavedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ph_saved_props') || '[]')
    } catch {
      return []
    }
  })

  const toggleSave = (prop) => {
    setSavedIds(prev => {
      let updated
      if (prev.includes(prop.id)) {
        updated = prev.filter(id => id !== prop.id)
        toast('Removed from saved parcels', { icon: '🤍' })
      } else {
        updated = [...prev, prop.id]
        toast.success(`Saved "${prop.title}" to shortlist!`)
      }
      try {
        localStorage.setItem('ph_saved_props', JSON.stringify(updated))
      } catch {
        // ignore
      }
      return updated
    })
  }

  const handleResetFilters = () => {
    setSearch('')
    setSelectedType('All')
    setSelectedLocation('All Locations')
    setSelectedBudget('all')
    setSelectedArea('all')
    setSort('newest')
  }

  // Active filter count
  const activeFiltersCount = (search ? 1 : 0) + 
    (selectedType !== 'All' ? 1 : 0) + 
    (selectedLocation !== 'All Locations' ? 1 : 0) + 
    (selectedBudget !== 'all' ? 1 : 0) + 
    (selectedArea !== 'all' ? 1 : 0)

  // Filtering logic
  const filtered = useMemo(() => {
    return properties.filter(p => {
      // Search term
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchesTitle = p.title.toLowerCase().includes(q)
        const matchesLoc = p.location.toLowerCase().includes(q)
        const matchesType = p.type.toLowerCase().includes(q)
        const matchesDesc = p.description.toLowerCase().includes(q)
        if (!matchesTitle && !matchesLoc && !matchesType && !matchesDesc) return false
      }

      // Property type
      if (selectedType !== 'All' && p.type !== selectedType) {
        return false
      }

      // Location
      if (selectedLocation !== 'All Locations' && !p.location.includes(selectedLocation)) {
        return false
      }

      // Budget
      if (selectedBudget === 'under-25' && p.minPriceLakh > 25) return false
      if (selectedBudget === '25-50' && (p.maxPriceLakh < 25 || p.minPriceLakh > 50)) return false
      if (selectedBudget === '50-100' && (p.maxPriceLakh < 50 || p.minPriceLakh > 100)) return false
      if (selectedBudget === 'above-100' && p.maxPriceLakh < 100) return false

      // Area (in acres equivalent)
      if (selectedArea === 'under-2' && p.acreEquivalent >= 2) return false
      if (selectedArea === '2-5' && (p.acreEquivalent < 2 || p.acreEquivalent > 5)) return false
      if (selectedArea === '5-10' && (p.acreEquivalent < 5 || p.acreEquivalent > 10)) return false
      if (selectedArea === 'above-10' && p.acreEquivalent < 10) return false

      return true
    }).sort((a, b) => {
      if (sort === 'price-asc') return a.minPriceLakh - b.minPriceLakh
      if (sort === 'price-desc') return b.maxPriceLakh - a.maxPriceLakh
      if (sort === 'area-asc') return a.acreEquivalent - b.acreEquivalent
      if (sort === 'area-desc') return b.acreEquivalent - a.acreEquivalent
      return 0 // newest default
    })
  }, [properties, search, selectedType, selectedLocation, selectedBudget, selectedArea, sort])

  return (
    <div className="explore">
      {/* ── Page Hero ───────────────────────────────────── */}
      <div className="explore__hero">
        <div className="explore__hero-backdrop" />
        <div className="container explore__hero-content">
          <motion.div 
            className="explore__eyebrow"
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <Sparkles size={14} className="explore__eyebrow-icon" />
            DISCOVER YOUR NEXT OPPORTUNITY
          </motion.div>

          <motion.h1 
            className="explore__title" 
            initial={{ opacity: 0, y: 22 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            EXPLORE LAND
          </motion.h1>

          <motion.p 
            className="explore__subtitle" 
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Curated land parcels, verified documentation, and high-yield opportunities across Maharashtra's premier investment corridors.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            className="explore__search-wrap" 
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <Search size={18} className="explore__search-icon" />
            <input
              type="search"
              className="explore__search-input"
              placeholder="Search by location, district, plot type, or features..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search properties"
            />
            {search && (
              <button 
                className="explore__search-clear" 
                onClick={() => setSearch('')}
                aria-label="Clear search text"
              >
                ✕
              </button>
            )}
            <button 
              className={`explore__filter-btn ${activeFiltersCount > 0 ? 'explore__filter-btn--active' : ''}`} 
              onClick={() => setShowFilters(v => !v)} 
              aria-label="Toggle search filters"
            >
              <SlidersHorizontal size={15} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="explore__filter-badge">{activeFiltersCount}</span>
              )}
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── Main Body ───────────────────────────────────── */}
      <div className="container explore__body">
        {/* Filters Panel */}
        <div className={`explore__filters ${showFilters ? 'explore__filters--open' : ''}`}>
          {/* Property Type Pills */}
          <div className="explore__filter-group explore__filter-group--types">
            <label className="explore__filter-label">Property Type</label>
            <div className="explore__filter-pills">
              {types.map(t => (
                <button 
                  key={t} 
                  className={`explore__pill ${selectedType === t ? 'explore__pill--active' : ''}`}
                  onClick={() => setSelectedType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="explore__filter-row">
            {/* Location */}
            <div className="explore__filter-group">
              <label className="explore__filter-label" htmlFor="filter-loc">Location</label>
              <select 
                id="filter-loc"
                className="form-select explore__select" 
                value={selectedLocation} 
                onChange={e => setSelectedLocation(e.target.value)}
              >
                {locationOpts.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* Budget */}
            <div className="explore__filter-group">
              <label className="explore__filter-label" htmlFor="filter-budget">Budget Range</label>
              <select 
                id="filter-budget"
                className="form-select explore__select" 
                value={selectedBudget} 
                onChange={e => setSelectedBudget(e.target.value)}
              >
                {budgetOpts.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>

            {/* Land Area */}
            <div className="explore__filter-group">
              <label className="explore__filter-label" htmlFor="filter-area">Land Area</label>
              <select 
                id="filter-area"
                className="form-select explore__select" 
                value={selectedArea} 
                onChange={e => setSelectedArea(e.target.value)}
              >
                {areaOpts.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>

            {/* Sort */}
            <div className="explore__filter-group">
              <label className="explore__filter-label" htmlFor="filter-sort">Sort By</label>
              <select 
                id="filter-sort"
                className="form-select explore__select" 
                value={sort} 
                onChange={e => setSort(e.target.value)}
              >
                {sortOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Reset button */}
            {activeFiltersCount > 0 && (
              <div className="explore__filter-group explore__filter-group--reset">
                <button 
                  className="btn btn-outline explore__reset-btn"
                  onClick={handleResetFilters}
                >
                  <RotateCcw size={13} /> Reset
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status notice */}
        <div className="explore__notice-banner">
          <div className="explore__notice-left">
            {isLiveDB ? (
              <span className="badge" style={{ background: 'rgba(39, 174, 96, 0.15)', color: '#27ae60', border: '1px solid rgba(39,174,96,0.3)' }}>
                MongoDB Live Database
              </span>
            ) : (
              <span className="badge badge-gold">Verified Pipeline Preview</span>
            )}
            <span className="explore__notice-text">
              {isLiveDB
                ? 'Serving live inventory dynamically from Express REST API connected to MongoDB database.'
                : 'Displaying demonstration parcels illustrating platform discovery, legal vetting, and spatial intelligence.'}
            </span>
          </div>
          <Link to="/list-land" className="explore__notice-link">
            Have land in Maharashtra? List with us →
          </Link>
        </div>

        {/* Results Bar */}
        <div className="explore__results-header">
          <span className="explore__results-count">
            <strong>{filtered.length}</strong> {filtered.length === 1 ? 'property' : 'properties'} found
          </span>
          {activeFiltersCount > 0 && (
            <span className="explore__active-indicator">
              Filtered by: {selectedType !== 'All' ? selectedType : ''} {selectedLocation !== 'All Locations' ? `• ${selectedLocation}` : ''}
            </span>
          )}
        </div>

        {/* Grid or Empty */}
        {loading ? (
          <div className="explore__empty">
            <div className="page-loader__ring" style={{ width: 48, height: 48, margin: '0 auto 1rem' }}>
              <div className="page-loader__inner" />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading live inventory...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="explore__empty">
            <div className="explore__empty-icon">
              <Search size={32} />
            </div>
            <h3>No matching parcels found</h3>
            <p>None of the properties match your current search and filter criteria. Try broadening your budget or location selection.</p>
            <button className="btn btn-gold" onClick={handleResetFilters}>
              <RotateCcw size={14} /> Clear All Filters
            </button>
          </div>
        ) : (
          <div className="explore__grid">
            <AnimatePresence mode="popLayout">
              {filtered.map((prop, i) => {
                const isSaved = savedIds.includes(prop.id)
                return (
                  <motion.div 
                    key={prop.id} 
                    className="prop-card"
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                  >
                    {/* Image wrap */}
                    <div className="prop-card__image-wrap">
                      <img 
                        src={prop.image} 
                        alt={prop.title} 
                        className="prop-card__image" 
                        loading="lazy" 
                      />
                      <div className="prop-card__image-overlay" />
                      
                      {/* Badges */}
                      <div className="prop-card__badges">
                        <span className="badge badge-gold">{prop.type}</span>
                        {prop.isLiveRecord ? (
                          <span className="badge" style={{ background: 'rgba(39,174,96,0.18)', color: '#27ae60', border: '1px solid rgba(39,174,96,0.25)', fontSize: '9px' }}>
                            MongoDB Verified
                          </span>
                        ) : (
                          <span className="badge prop-card__demo-badge">Curated Demo Parcel</span>
                        )}
                      </div>

                      {/* Bookmark Button */}
                      <button 
                        className={`prop-card__save-btn ${isSaved ? 'prop-card__save-btn--active' : ''}`}
                        onClick={() => toggleSave(prop)}
                        aria-label={isSaved ? 'Remove from saved' : 'Save property'}
                        title={isSaved ? 'Remove from saved' : 'Save property'}
                      >
                        <Heart size={16} fill={isSaved ? 'var(--gold-primary)' : 'none'} />
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="prop-card__body">
                      <div className="prop-card__location">
                        <MapPin size={13} className="prop-card__loc-icon" />
                        <span>{prop.location}</span>
                      </div>

                      <h2 className="prop-card__title">
                        <Link to={`/property/${prop.id}`}>{prop.title}</Link>
                      </h2>

                      <p className="prop-card__description">
                        {prop.description}
                      </p>

                      {/* Specs Row */}
                      <div className="prop-card__meta">
                        <div className="prop-card__meta-item">
                          <Ruler size={14} />
                          <span>{prop.area} {prop.unit}</span>
                        </div>
                        <div className="prop-card__price">
                          <IndianRupee size={14} />
                          <span>{prop.price}</span>
                        </div>
                      </div>

                      {/* Infrastructure Tags */}
                      <div className="prop-card__infra">
                        {prop.infra.map(inf => (
                          <span key={inf} className="prop-card__infra-tag">
                            <CheckCircle2 size={11} className="prop-card__infra-icon" />
                            {inf}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="prop-card__actions">
                        <Link 
                          to={`/property/${prop.id}`} 
                          className="btn btn-gold prop-card__view"
                        >
                          <Eye size={14} /> View Details
                        </Link>
                        <Link 
                          to={`/property/${prop.id}#enquire`} 
                          className="btn btn-outline prop-card__enquire"
                        >
                          <MessageSquare size={14} /> Enquire Now
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
