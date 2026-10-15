import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Hero from '../components/home/Hero'
import WhySection from '../components/home/WhySection'
import LocationSection from '../components/home/LocationSection'
import FeaturedProperties from '../components/home/FeaturedProperties'
import LeadForm from '../components/home/LeadForm'
import './Home.css'

// Lazy sections
const CommunityPreview = lazy(() => import('../components/home/CommunityPreview'))
const PartnerCTA = lazy(() => import('../components/home/PartnerCTA'))

export default function Home() {
  return (
    <div className="home">
      <Hero />
      <WhySection />
      <LocationSection />
      <FeaturedProperties />
      <LeadForm />
      <Suspense fallback={<div style={{ height: 200 }} />}>
        <CommunityPreview />
        <PartnerCTA />
      </Suspense>
      <FinalCTA />
    </div>
  )
}

function FinalCTA() {
  return (
    <section className="final-cta section">
      <div className="container">
        <motion.div
          className="final-cta__inner"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <img 
            src="/assets/plottage-hub-logo.png" 
            alt="Plottage Hub" 
            style={{ height: '68px', width: 'auto', margin: '0 auto 1.5rem', display: 'block', borderRadius: '8px', filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.8))' }} 
          />
          <span className="section-eyebrow" style={{ justifyContent: 'center' }}>
            Begin Today
          </span>
          <h2 className="final-cta__title">
            YOUR NEXT OPPORTUNITY<br />
            <span className="gradient-text">STARTS HERE.</span>
          </h2>
          <p className="final-cta__desc">
            Whether you're searching for land or ready to list yours — Plottage Hub is where it begins.
          </p>
          <div className="final-cta__actions">
            <Link to="/explore" className="btn btn-gold">Find Your Land</Link>
            <Link to="/list-land" className="btn btn-outline">List Your Land</Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
