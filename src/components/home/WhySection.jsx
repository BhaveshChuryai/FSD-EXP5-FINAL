import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Search, BarChart2, Users, TrendingUp } from 'lucide-react'
import './WhySection.css'

const pillars = [
  {
    icon: Search,
    title: 'DISCOVER',
    desc: 'Explore land opportunities across Maharashtra — from hill stations to coastlines and urban corridors.',
  },
  {
    icon: BarChart2,
    title: 'EVALUATE',
    desc: 'Review available property details, infrastructure, documentation status, and location intelligence.',
  },
  {
    icon: Users,
    title: 'CONNECT',
    desc: 'Connect directly with buyers, landowners, brokers, and developers through a trusted platform.',
  },
  {
    icon: TrendingUp,
    title: 'GROW',
    desc: 'Explore potential investment, development, and collaboration opportunities across Maharashtra.',
  },
]

export default function WhySection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="why section" ref={ref}>
      <div className="container">
        <motion.div
          className="why__header"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="section-eyebrow">Why Plottage Hub</span>
          <h2 className="why__title">
            MORE THAN LAND.<br />
            <span className="gradient-text">A WORLD OF POSSIBILITIES.</span>
          </h2>
          <p className="why__desc">
            Plottage Hub connects people with land opportunities and the professionals who help make those opportunities possible.
          </p>
        </motion.div>

        <div className="why__pillars">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              className="why__pillar"
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
            >
              <div className="why__pillar-icon">
                <p.icon size={28} strokeWidth={1.5} />
              </div>
              <div className="why__pillar-line" />
              <h3 className="why__pillar-title">{p.title}</h3>
              <p className="why__pillar-desc">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
