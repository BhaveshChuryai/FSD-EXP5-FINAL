import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', textAlign: 'center', padding: '2rem'
    }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--gold-primary)', marginBottom: '1.5rem' }}>
          404
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 500, marginBottom: '1rem' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: 400, margin: '0 auto 2.5rem' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-gold"><Home size={16} /> Back to Home</Link>
          <Link to="/explore" className="btn btn-outline">Explore Land</Link>
        </div>
      </motion.div>
    </div>
  )
}
