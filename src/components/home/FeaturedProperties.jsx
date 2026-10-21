import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Ruler, IndianRupee, Eye, MessageSquare } from 'lucide-react'
import { propertiesAPI } from '../../services/api'
import './FeaturedProperties.css'

// Demo data — clearly labeled; fallback if offline
const demoProperties = [
  {
    id: 'demo-1',
    title: 'Agricultural Land with River Access',
    location: 'Karjat, Raigad',
    area: '5',
    areaUnit: 'Acres',
    price: '₹ 45 – 55 Lakh',
    type: 'Agricultural',
    image: '/assets/property-agri.jpg',
    infrastructure: ['Road access', 'River frontage', 'Power line'],
    isDemo: true,
  },
  {
    id: 'demo-2',
    title: 'Premium Residential Plotted Development',
    location: 'Lonavala, Pune',
    area: '2,400',
    areaUnit: 'Sq.ft',
    price: '₹ 18 – 24 Lakh',
    type: 'Residential',
    image: '/assets/property-residential.jpg',
    infrastructure: ['Internal roads', 'Electricity', 'Boundary wall'],
    isDemo: true,
  },
  {
    id: 'demo-3',
    title: 'Coastal Land with Sea View',
    location: 'Alibaug, Raigad',
    area: '15',
    areaUnit: 'Guntha',
    price: '₹ 35 – 50 Lakh',
    type: 'Farmhouse',
    image: '/assets/alibaug.jpg',
    infrastructure: ['Coastal road', 'Water bore', 'View plot'],
    isDemo: true,
  },
]

export default function FeaturedProperties() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [properties, setProperties] = useState(demoProperties)
  const [isLiveDB, setIsLiveDB] = useState(false)

  useEffect(() => {
    let mounted = true
    const fetchFeatured = async () => {
      try {
        const res = await propertiesAPI.getAll({ limit: 3 })
        if (mounted && res.data?.data && res.data.data.length > 0) {
          const mapped = res.data.data.map(p => ({
            id: p._id || p.id,
            title: p.title,
            location: p.location,
            area: String(p.area),
            areaUnit: p.areaUnit,
            price: p.price,
            type: p.propertyType,
            image: (p.images && p.images[0]) || '/assets/property-agri.jpg',
            infrastructure: p.infrastructure || ['Clear Title', 'Road Access'],
            isDemo: false,
          }))
          setProperties(mapped)
          setIsLiveDB(true)
        }
      } catch {
        setIsLiveDB(false)
      }
    }
    fetchFeatured()
    return () => { mounted = false }
  }, [])

  return (
    <section className="featured section" ref={ref}>
      <div className="container">
        <motion.div
          className="featured__header"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="section-eyebrow">Featured Properties</span>
          <h2 className="featured__title">
            CURATED LAND <span className="gradient-text">OPPORTUNITIES</span>
          </h2>
          <p className="featured__desc">
            Explore a selection of noteworthy land opportunities across Maharashtra's most sought-after locations.
          </p>
          <p className="featured__demo-notice" style={isLiveDB ? { color: 'var(--success)' } : {}}>
            {isLiveDB ? '✓ Live Inventory: Connected to MongoDB Database' : '⚠ Demonstration data — not verified live inventory'}
          </p>
        </motion.div>

        <div className="featured__grid">
          {properties.map((prop, i) => (
            <motion.div
              key={prop.id}
              className="prop-card"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
            >
              {/* Image */}
              <div className="prop-card__image-wrap">
                <img src={prop.image} alt={prop.title} className="prop-card__image" loading="lazy" />
                <div className="prop-card__image-overlay" />
                <div className="prop-card__badges">
                  <span className="badge badge-gold">{prop.type}</span>
                  {prop.isDemo && <span className="badge" style={{ background: 'rgba(192,57,43,0.18)', color: '#C0392B', border: '1px solid rgba(192,57,43,0.25)', fontSize: '9px' }}>DEMO</span>}
                </div>
              </div>

              {/* Body */}
              <div className="prop-card__body">
                <h3 className="prop-card__title">{prop.title}</h3>
                <div className="prop-card__location">
                  <MapPin size={12} />
                  <span>{prop.location}</span>
                </div>
                <div className="prop-card__meta">
                  <div className="prop-card__meta-item">
                    <Ruler size={13} />
                    <span>{prop.area} {prop.areaUnit}</span>
                  </div>
                  <div className="prop-card__price">
                    <IndianRupee size={13} />
                    <span>{prop.price}</span>
                  </div>
                </div>
                <div className="prop-card__infra">
                  {prop.infrastructure.map(inf => (
                    <span key={inf} className="prop-card__infra-tag">{inf}</span>
                  ))}
                </div>
                <div className="prop-card__actions">
                  <Link to={`/property/${prop.id}`} className="btn btn-gold prop-card__view">
                    <Eye size={14} /> View Details
                  </Link>
                  <Link to={`/property/${prop.id}#enquire`} className="btn btn-outline prop-card__enquire">
                    <MessageSquare size={14} /> Enquire
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="featured__footer">
          <Link to="/explore" className="btn btn-outline">
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  )
}
