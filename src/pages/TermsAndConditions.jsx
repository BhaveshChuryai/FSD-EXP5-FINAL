import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, ArrowLeft } from 'lucide-react'

export default function TermsAndConditions() {
  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="container" style={{ padding: '3rem 2rem', maxWidth: 800 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link to="/" className="btn btn-ghost" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
            <FileText size={28} color="var(--gold-primary)" />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-primary)' }}>
              Legal
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500, marginBottom: '0.5rem' }}>
            Terms &amp; Conditions
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: '2.5rem' }}>
            Last updated: October 2026
          </p>

          {[
            {
              title: '1. Acceptance of Terms',
              content: 'By accessing and using Plottage Hub, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.',
            },
            {
              title: '2. Use of Platform',
              content: 'Plottage Hub is a land discovery and real estate networking platform for Maharashtra. The platform facilitates connections between buyers, sellers, brokers, and developers. All users must be 18 years or older. You agree to use the platform for lawful purposes only.',
            },
            {
              title: '3. Property Listings',
              content: 'Property information displayed on Plottage Hub is provided by owners, brokers, and partners. While we endeavor to verify listing accuracy, we make no warranties regarding completeness or accuracy. Users are advised to independently verify all property details, legal status, and documentation before any transaction.',
            },
            {
              title: '4. No Brokerage Guarantee',
              content: 'Plottage Hub is a discovery and connection platform and does not guarantee any transaction or deal closure. Commission structures, if applicable, will be disclosed separately. Platform usage for property enquiries is free for buyers.',
            },
            {
              title: '5. Intellectual Property',
              content: 'All content on this platform including text, graphics, logos, and software is the property of Plottage Hub and is protected under applicable intellectual property laws. Unauthorized use, reproduction, or distribution is prohibited.',
            },
            {
              title: '6. Limitation of Liability',
              content: 'Plottage Hub shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of or inability to use the platform. The platform is provided on an "as is" basis without warranties of any kind.',
            },
            {
              title: '7. Contact',
              content: 'For any questions regarding these Terms & Conditions, please contact us at plottagehub@gmail.com or call +91 88559 08374.',
            },
          ].map((section) => (
            <div key={section.title} style={{ marginBottom: '2rem', padding: '1.75rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 500, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                {section.title}
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-normal)', fontSize: '0.9375rem' }}>
                {section.content}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
