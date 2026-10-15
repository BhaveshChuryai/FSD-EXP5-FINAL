import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import './PartnerCTA.css'

const roles = [
  { emoji: '🏡', title: 'Landowner', desc: 'List your land with our trusted network' },
  { emoji: '🤝', title: 'Broker', desc: 'Join as a channel or referral partner' },
  { emoji: '🏗️', title: 'Developer', desc: 'Explore development collaboration' },
  { emoji: '📈', title: 'Investor', desc: 'Discover curated land opportunities' },
  { emoji: '🌐', title: 'Strategic Partner', desc: 'Grow your services with our community' },
]

export default function PartnerCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="partner-cta section" ref={ref}>
      <div className="container">
        <motion.div
          className="partner-cta__inner"
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="section-eyebrow">Partnership</span>
          <h2 className="partner-cta__title">
            YOUR LAND. YOUR VISION.<br />
            <span className="gradient-text">OUR NETWORK.</span>
          </h2>
          <p className="partner-cta__desc">
            Whether you're a landowner, broker, developer, investor, or strategic partner — Plottage Hub creates meaningful connections across Maharashtra's land market.
          </p>

          <div className="partner-cta__roles">
            {roles.map((role, i) => (
              <motion.div
                key={role.title}
                className="partner-role"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <span className="partner-role__emoji">{role.emoji}</span>
                <span className="partner-role__title">{role.title}</span>
                <span className="partner-role__desc">{role.desc}</span>
              </motion.div>
            ))}
          </div>

          <Link to="/partner" className="btn btn-gold partner-cta__btn">
            EXPLORE PARTNERSHIPS
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
