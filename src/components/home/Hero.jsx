import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Users } from 'lucide-react'
import './Hero.css'

const landCategories = [
  { icon: '🌿', label: 'AGRICULTURAL LAND' },
  { icon: '🏡', label: 'RESIDENTIAL PLOTS' },
  { icon: '🏢', label: 'COMMERCIAL LAND' },
  { icon: '📈', label: 'INVESTMENT LAND' },
  { icon: '🏗️', label: 'DEVELOPMENT LAND' },
  { icon: '🌳', label: 'FARMHOUSE OPPORTUNITIES' },
]

const locationPins = [
  { name: 'LONAVALA', top: '22%', left: '52%' },
  { name: 'KARJAT',   top: '38%', left: '62%' },
  { name: 'ALIBAUG',  top: '35%', left: '82%' },
]

const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function Hero() {
  const videoRef = useRef(null)

  return (
    <section className="hero" aria-label="Hero">
      {/* ── Cinematic video background ─────────────────── */}
      <div className="hero__video-wrap">
        <video
          ref={videoRef}
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/lonavala.jpg"
          aria-hidden="true"
        >
          <source src="/assets/plottagehubbg.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlays */}
        <div className="hero__overlay" />
        <div className="hero__overlay-left" />
        <div className="hero__overlay-bottom" />
      </div>

      {/* ── Location pins ───────────────────────────────── */}
      <div className="hero__pins" aria-hidden="true">
        {locationPins.map((pin, i) => (
          <motion.div
            key={pin.name}
            className="hero__pin"
            style={{ top: pin.top, left: pin.left }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8 + i * 0.2, duration: 0.4 }}
          >
            <div className="hero__pin-dot" />
            <div className="hero__pin-pulse" />
            <span className="hero__pin-label">{pin.name}</span>
          </motion.div>
        ))}
      </div>

      {/* ── Hero content ────────────────────────────────── */}
      <div className="hero__content container">
        <motion.div
          className="hero__content-inner"
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <motion.div
            className="hero__eyebrow"
            variants={fadeUp}
            custom={0.2}
          >
            <span className="hero__eyebrow-dot" />
            THE FUTURE OF LAND DISCOVERY
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="hero__headline"
            variants={fadeUp}
            custom={0.4}
          >
            <span className="hero__headline-white">DISCOVER LAND.</span>
            <br />
            <span className="hero__headline-gold">UNLOCK</span>
            <br />
            <span className="hero__headline-gold">POSSIBILITIES.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="hero__subtext"
            variants={fadeUp}
            custom={0.65}
          >
            Explore exceptional land opportunities, connect with trusted property
            professionals, and discover the possibilities shaping Maharashtra's
            real-estate future.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="hero__ctas"
            variants={fadeUp}
            custom={0.85}
          >
            <Link to="/explore" className="btn btn-gold hero__cta-primary">
              EXPLORE LAND <ArrowRight size={16} />
            </Link>
            <Link to="/partner" className="btn btn-outline hero__cta-secondary">
              <Users size={16} /> PARTNER WITH US
            </Link>
          </motion.div>

          {/* Land categories */}
          <motion.div
            className="hero__categories"
            variants={fadeUp}
            custom={1.05}
          >
            {landCategories.map(cat => (
              <Link
                key={cat.label}
                to={`/explore?type=${cat.label.toLowerCase().replace(/\s+/g, '-')}`}
                className="hero__cat"
              >
                <span className="hero__cat-icon">{cat.icon}</span>
                <span className="hero__cat-label">{cat.label}</span>
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────── */}
      <motion.div
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        aria-hidden="true"
      >
        <div className="hero__scroll-track">
          <div className="hero__scroll-thumb" />
        </div>
        <span className="hero__scroll-text">SCROLL TO EXPLORE</span>
      </motion.div>
    </section>
  )
}
