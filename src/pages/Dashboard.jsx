import { useSelector } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Heart, FileText, Bell, LogOut } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'

export default function Dashboard() {
  const { isAuthenticated, user } = useSelector(s => s.auth)
  const dispatch = useDispatch()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="container" style={{ padding: '3rem 2rem' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--gold-subtle)', border: '2px solid var(--gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={28} color="var(--gold-primary)" />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 500 }}>
                Welcome, {user?.name || 'Member'}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{user?.email}</p>
            </div>
            <button onClick={() => dispatch(logout())} className="btn btn-ghost" style={{ marginLeft: 'auto', color: 'var(--error)' }}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: Heart, title: 'Saved Properties', desc: 'Properties you saved for later', count: 0 },
              { icon: FileText, title: 'My Enquiries', desc: 'Requirements & enquiries submitted', count: 0 },
              { icon: Bell, title: 'Notifications', desc: 'Updates from Plottage Hub', count: 0 },
            ].map(item => (
              <div key={item.title} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', transition: 'all 0.25s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--gold-subtle)', border: '1px solid var(--gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <item.icon size={20} color="var(--gold-primary)" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{item.desc}</p>
                  </div>
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--gold-primary)', fontWeight: 500 }}>{item.count}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/explore" className="btn btn-gold">Explore Properties</Link>
            <Link to="/partner" className="btn btn-outline">Partner Application</Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
