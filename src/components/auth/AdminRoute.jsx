import { useSelector } from 'react-redux'
import { Navigate, useLocation, Link } from 'react-router-dom'
import { ShieldAlert, Home, UserCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import PageLoader from '../ui/PageLoader'

/**
 * Route guard requiring administrator authorization (role === 'admin' or 'Admin').
 * Displays an editorial access-denied state if authenticated as a standard user.
 */
export default function AdminRoute({ children }) {
  const { isAuthenticated, user, sessionRestoring } = useSelector((s) => s.auth)
  const location = useLocation()

  if (sessionRestoring) {
    return <PageLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const role = (user?.role || '').toLowerCase()
  const isAdmin = role === 'admin'

  if (!isAdmin) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6rem 1.5rem 3rem',
          background: 'var(--bg-primary)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            maxWidth: 520,
            width: '100%',
            background: 'var(--bg-card)',
            border: '1px solid rgba(192, 57, 43, 0.3)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(192, 57, 43, 0.12)',
              border: '1px solid rgba(192, 57, 43, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <ShieldAlert size={32} color="#E74C3C" />
          </div>

          <span
            style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#E74C3C',
              marginBottom: '0.5rem',
            }}
          >
            HTTP 403 Forbidden
          </span>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 500,
              color: 'var(--text-primary)',
              marginBottom: '0.75rem',
            }}
          >
            Access Restricted
          </h1>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9375rem',
              lineHeight: 1.6,
              marginBottom: '1.5rem',
            }}
          >
            You are signed in as <strong style={{ color: 'var(--gold-primary)' }}>{user?.name}</strong> with role{' '}
            <code style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4 }}>
              {user?.role || 'user'}
            </code>
            . Administrative privileges are required to view the operations dashboard.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link to="/dashboard" className="btn btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <UserCheck size={16} /> User Dashboard
            </Link>
            <Link to="/" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Home size={16} /> Return Home
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return children
}
