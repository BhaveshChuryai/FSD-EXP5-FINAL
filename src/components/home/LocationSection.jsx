import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { MapPin, ArrowRight } from 'lucide-react'
import './LocationSection.css'

const locations = [
  {
    id: 'lonavala',
    name: 'Lonavala',
    tagline: 'Hill Station & Valley Living',
    desc: 'Escape to Maharashtra\'s iconic hill station. Lush valleys, waterfalls, and a growing farmhouse land market make Lonavala a perennial favourite.',
    image: '/assets/lonavala.jpg',
    types: ['Farmhouse Land', 'Agricultural', 'Residential'],
  },
  {
    id: 'alibaug',
    name: 'Alibaug',
    tagline: 'Coastal & Second-Home Retreat',
    desc: 'Maharashtra\'s premier coastal getaway. Minutes from Mumbai by sea, Alibaug is sought-after for weekend retreats and long-term coastal investments.',
    image: '/assets/alibaug.jpg',
    types: ['Coastal Land', 'Farmhouse', 'Residential'],
  },
  {
    id: 'karjat',
    name: 'Karjat',
    tagline: 'Riverside & Forest Wilderness',
    desc: 'Serene riverbanks and forested hills make Karjat a hotspot for nature-integrated living, farmhouse development, and weekend retreat projects.',
    image: '/assets/karjat.jpg',
    types: ['Agricultural', 'Farmhouse', 'Residential'],
  },
  {
    id: 'panvel',
    name: 'Panvel',
    tagline: 'Urban Gateway to Growth',
    desc: 'Strategically positioned at the confluence of highways and the new Navi Mumbai airport corridor, Panvel is one of the fastest-evolving investment destinations.',
    image: '/assets/panvel.jpg',
    types: ['Commercial', 'Residential', 'Investment'],
  },
  {
    id: 'khopoli',
    name: 'Khopoli',
    tagline: 'Industrial & Investment Corridor',
    desc: 'A rising industrial and investment corridor along Mumbai–Pune highway, Khopoli offers strong connectivity and diverse land opportunities.',
    image: '/assets/lonavala.jpg',
    types: ['Commercial', 'Industrial', 'Agricultural'],
  },
  {
    id: 'pali',
    name: 'Pali',
    tagline: 'Coastal Konkan Serenity',
    desc: 'Pali\'s pristine coastline and cultural heritage attract buyers looking for peaceful coastal land with long-term value and natural beauty.',
    image: '/assets/alibaug.jpg',
    types: ['Coastal', 'Agricultural', 'Residential'],
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function LocationSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="locations section" ref={ref}>
      <div className="container">
        <motion.div
          className="locations__header"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="section-eyebrow">Explore Maharashtra</span>
          <h2 className="locations__title">
            WHERE WILL YOUR OPPORTUNITY<br />
            <span className="gradient-text">BE FOUND?</span>
          </h2>
          <p className="locations__desc">
            From hill stations to coastlines to urban corridors — discover the locations shaping Maharashtra's land market.
          </p>
        </motion.div>

        <div className="locations__grid">
          {locations.map((loc, i) => (
            <motion.div
              key={loc.id}
              className="location-card"
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              custom={i}
            >
              <div className="location-card__image-wrap">
                <img src={loc.image} alt={loc.name} className="location-card__image" loading="lazy" />
                <div className="location-card__image-overlay" />
              </div>
              <div className="location-card__body">
                <div className="location-card__header">
                  <MapPin size={14} className="location-card__pin" />
                  <span className="location-card__name">{loc.name}</span>
                </div>
                <p className="location-card__tagline">{loc.tagline}</p>
                <p className="location-card__desc">{loc.desc}</p>
                <div className="location-card__types">
                  {loc.types.map(t => (
                    <span key={t} className="badge badge-gold">{t}</span>
                  ))}
                </div>
                <Link
                  to={`/explore?location=${loc.id}`}
                  className="location-card__cta"
                >
                  Explore {loc.name} <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
