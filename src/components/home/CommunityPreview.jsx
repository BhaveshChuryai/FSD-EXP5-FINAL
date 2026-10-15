import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MessageCircle, MapPin, TrendingUp, FileText, Users } from 'lucide-react'
import './CommunityPreview.css'

const demoTopics = [
  { icon: MapPin,      cat: 'Location Insights',  title: 'What makes Karjat the best kept secret for farmhouse investment?',     replies: 14, author: 'Rahul M.' },
  { icon: TrendingUp,  cat: 'Land Investment',     title: 'Road connectivity expansion near Panvel — what does it mean for land buyers?', replies: 9, author: 'Priya S.' },
  { icon: FileText,    cat: 'Documentation',       title: 'Understanding 7/12 extract — a practical guide for first-time buyers', replies: 22, author: 'Amit K.' },
  { icon: Users,       cat: 'Broker Network',      title: 'Tips for evaluating a land broker in Maharashtra',                    replies: 7, author: 'Sneha P.' },
]

export default function CommunityPreview() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="community-preview section" ref={ref}>
      <div className="container">
        <div className="community-preview__layout">
          <motion.div
            className="community-preview__copy"
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="section-eyebrow">Community</span>
            <h2 className="community-preview__title">
              KNOWLEDGE SHARED.<br />
              <span className="gradient-text">DECISIONS INFORMED.</span>
            </h2>
            <p className="community-preview__desc">
              Join Maharashtra's growing community of land buyers, sellers, brokers, and investors. Share insights, ask questions, and learn from people who know the market.
            </p>
            <div className="community-preview__cats">
              {['Location Insights', 'Infrastructure', 'Buying & Selling', 'Land Investment', 'Documentation', 'Broker Network'].map(c => (
                <span key={c} className="badge badge-gold">{c}</span>
              ))}
            </div>
            <Link to="/community" className="btn btn-gold" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
              JOIN THE COMMUNITY
            </Link>
          </motion.div>

          <motion.div
            className="community-preview__topics"
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="community-preview__demo-note">Demonstration discussions — not real user posts</p>
            {demoTopics.map((t, i) => (
              <div key={i} className="topic-card">
                <div className="topic-card__icon">
                  <t.icon size={16} />
                </div>
                <div className="topic-card__body">
                  <span className="topic-card__cat">{t.cat}</span>
                  <p className="topic-card__title">{t.title}</p>
                  <div className="topic-card__meta">
                    <span>{t.author}</span>
                    <span><MessageCircle size={12} /> {t.replies} replies</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
