import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, ArrowLeft } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="container" style={{ padding: '3rem 2rem', maxWidth: 800 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link to="/" className="btn btn-ghost" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
            <ShieldCheck size={28} color="var(--gold-primary)" />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-primary)' }}>
              Legal
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500, marginBottom: '0.5rem' }}>
            Privacy Policy
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: '2.5rem' }}>
            Last updated: October 2026
          </p>

          {[
            {
              title: '1. Information We Collect',
              content: 'We collect information you provide directly to us when you register, fill out forms, or contact us. This includes your name, email address, phone number, and property-related information. We also collect usage data such as pages visited and features used.',
            },
            {
              title: '2. How We Use Your Information',
              content: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices, and respond to your comments and questions. We may use your contact information to send you information about our services and listings.',
            },
            {
              title: '3. Information Sharing',
              content: 'We do not share your personal information publicly or with third parties except to provide our platform services, comply with law, or protect our rights. Your property enquiry details may be shared with relevant landowners or brokers to facilitate your request.',
            },
            {
              title: '4. Data Security',
              content: 'We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. Data is stored securely and access is restricted to authorized personnel only.',
            },
            {
              title: '5. Cookies',
              content: 'We use cookies and similar tracking technologies to track activity on our platform and hold certain information to improve your experience. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.',
            },
            {
              title: '6. Contact Us',
              content: 'If you have any questions about this Privacy Policy, please contact us at plottagehub@gmail.com or call +91 88559 08374.',
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
