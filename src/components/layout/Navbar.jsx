import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search, ChevronDown, User, LogOut } from 'lucide-react'
import { toggleMobileMenu, setMobileMenuOpen } from '../../store/slices/uiSlice'
import { logout } from '../../store/slices/authSlice'
import './Navbar.css'

const navLinks = [
  { label: 'Home',          to: '/' },
  { label: 'Explore Land',  to: '/explore' },
  { label: 'Projects',      to: '/explore?type=projects' },
  { label: 'Community',     to: '/community' },
  { label: 'Partner With Us', to: '/partner' },
]

export default function Navbar() {
  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const location    = useLocation()
  const { mobileMenuOpen } = useSelector(s => s.ui)
  const { isAuthenticated, user } = useSelector(s => s.auth)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    dispatch(setMobileMenuOpen(false))
  }, [dispatch, location.pathname])

  const handleLogout = () => {
    dispatch(logout())
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <>
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo" aria-label="Plottage Hub Home">
            <img
              src="/assets/plottage-hub-logo.png"
              alt="Plottage Hub — Discover Land. Unlock Possibilities."
              className="navbar__logo-img"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="navbar__nav" aria-label="Main navigation">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="navbar__actions">
            <button className="navbar__search" aria-label="Search">
              <Search size={18} />
            </button>

            {isAuthenticated ? (
              <div className="navbar__user-menu">
                <button
                  className="navbar__user-btn"
                  onClick={() => setUserMenuOpen(v => !v)}
                  aria-expanded={userMenuOpen}
                >
                  <User size={16} />
                  <span>{user?.name?.split(' ')[0] || 'Account'}</span>
                  <ChevronDown size={14} className={userMenuOpen ? 'rotate-180' : ''} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      className="navbar__dropdown"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="navbar__dropdown-item">
                        <User size={14} /> Dashboard
                      </Link>
                      <button onClick={handleLogout} className="navbar__dropdown-item navbar__dropdown-item--danger">
                        <LogOut size={14} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="btn btn-ghost navbar__login">Login</Link>
            )}

            <Link to="/list-land" className="btn btn-gold navbar__cta">
              List Your Land
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="navbar__hamburger"
            onClick={() => dispatch(toggleMobileMenu())}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="navbar__mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dispatch(setMobileMenuOpen(false))}
            />
            <motion.div
              className="navbar__mobile"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="navbar__mobile-header">
                <Link to="/" className="navbar__logo" onClick={() => dispatch(setMobileMenuOpen(false))}>
                  <img
                    src="/assets/plottage-hub-logo.png"
                    alt="Plottage Hub"
                    className="navbar__logo-img navbar__logo-img--mobile"
                  />
                </Link>
                <button onClick={() => dispatch(setMobileMenuOpen(false))} aria-label="Close menu">
                  <X size={20} color="var(--text-primary)" />
                </button>
              </div>

              <nav className="navbar__mobile-nav">
                {navLinks.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
                    }
                    onClick={() => dispatch(setMobileMenuOpen(false))}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              <div className="navbar__mobile-footer">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => dispatch(setMobileMenuOpen(false))}>
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', color: 'var(--error)' }}>
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => dispatch(setMobileMenuOpen(false))}>
                    Login
                  </Link>
                )}
                <Link to="/list-land" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => dispatch(setMobileMenuOpen(false))}>
                  List Your Land
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
