import { useSelector, useDispatch } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Heart, FileText, Bell, LogOut, Shield, MapPin, Ruler, Trash2, ArrowRight } from 'lucide-react'
import { logoutUser } from '../store/slices/authSlice'
import { removeSavedProperty } from '../store/slices/propertySlice'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { isAuthenticated, user } = useSelector(s => s.auth)
  const { savedProperties = [] } = useSelector(s => s.properties)
  const dispatch = useDispatch()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const isAdmin = (user?.role || '').toLowerCase() === 'admin'

  const handleRemoveSaved = (id, title) => {
    dispatch(removeSavedProperty(id))
    toast.success(`Removed "${title}" from shortlist`)
  }

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="container" style={{ padding: '3rem 2rem' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--gold-subtle)', border: '2px solid var(--gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={28} color="var(--gold-primary)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 500 }}>
                  Welcome, {user?.name || 'Member'}
                </h1>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: isAdmin ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                    border: `1px solid ${isAdmin ? 'var(--gold-primary)' : 'rgba(255,255,255,0.15)'}`,
                    color: isAdmin ? 'var(--gold-primary)' : 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {user?.role || 'user'}
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{user?.email}</p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
              {isAdmin && (
                <Link to="/admin" className="btn btn-outline" style={{ borderColor: 'var(--gold-primary)', color: 'var(--gold-primary)' }}>
                  <Shield size={16} /> Admin Portal
                </Link>
              )}
              <button onClick={() => dispatch(logoutUser())} className="btn btn-ghost" style={{ color: 'var(--error)' }}>
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {[
              { icon: Heart, title: 'Saved Properties', desc: 'Shortlisted land parcels', count: savedProperties.length },
              { icon: FileText, title: 'My Enquiries', desc: 'Requirements & site visits', count: 0 },
              { icon: Bell, title: 'Notifications', desc: 'Verified property updates', count: 0 },
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

          {/* Saved Properties Section */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 500 }}>
                  Shortlisted Land Parcels ({savedProperties.length})
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Verified plots and agricultural parcels saved for review and comparison
                </p>
              </div>
              <Link to="/explore" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
                Discover More Land <ArrowRight size={14} />
              </Link>
            </div>

            {savedProperties.length === 0 ? (
              <div style={{
                background: 'var(--bg-card)',
                border: '1px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: '3rem 2rem',
                textAlign: 'center',
              }}>
                <Heart size={40} color="var(--gold-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '0.5rem' }}>No Saved Properties Yet</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: 420, margin: '0 auto 1.5rem' }}>
                  Explore premium agricultural land, residential plots, and farmhouse estates across Maharashtra to bookmark your favorites.
                </p>
                <Link to="/explore" className="btn btn-gold">
                  Explore Land Parcels
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {savedProperties.map(p => (
                  <div
                    key={p.id}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ position: 'relative', height: 160, background: 'var(--bg-secondary)' }}>
                      <img
                        src={p.image || '/assets/property-agri.jpg'}
                        alt={p.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          padding: '3px 8px',
                          borderRadius: 4,
                          background: 'rgba(0,0,0,0.7)',
                          color: 'var(--gold-primary)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {p.type}
                      </span>
                      <button
                        onClick={() => handleRemoveSaved(p.id, p.title)}
                        aria-label="Remove saved property"
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: 'rgba(0,0,0,0.65)',
                          border: 'none',
                          color: 'var(--error)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                        {p.title}
                      </h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4, marginBottom: '0.75rem' }}>
                        <MapPin size={13} color="var(--gold-primary)" /> {p.location}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Ruler size={13} /> {p.area} {p.unit}
                        </span>
                        <span style={{ fontWeight: 600, color: 'var(--gold-primary)', marginLeft: 'auto', fontSize: '0.95rem' }}>
                          {p.price}
                        </span>
                      </div>
                      <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/property/${p.id}`} className="btn btn-outline" style={{ flex: 1, padding: '6px 12px', fontSize: '0.8rem', justifyContent: 'center' }}>
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/explore" className="btn btn-gold">Explore Properties</Link>
            <Link to="/partner" className="btn btn-outline">Partner Application</Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
