import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setUser, setToken } from '../store/slices/authSlice'
import axios from 'axios'
import toast from 'react-hot-toast'
import './Auth.css'

const roles = ['Customer / Buyer', 'Landowner', 'Broker', 'Developer', 'Investor']

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'Customer / Buyer' })
  const [showPwd, setShowPwd] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: undefined }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Enter a valid email'
    if (!form.phone.match(/^[6-9]\d{9}$/)) errs.phone = 'Enter a valid 10-digit mobile number'
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters'
    return errs
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const res = await axios.post('/api/auth/register', form)
      dispatch(setToken(res.data.token))
      dispatch(setUser(res.data.user))
      toast.success('Account created! Welcome to Plottage Hub.')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__bg" />
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="auth-card__logo">
            <Link to="/" aria-label="Plottage Hub Home">
              <img
                src="/assets/plottage-hub-logo.png"
                alt="Plottage Hub"
                className="auth-card__logo-img"
              />
            </Link>
          </div>

          <h1 className="auth-card__title">Create Account</h1>
          <p className="auth-card__subtitle">Join Maharashtra's premium land discovery platform</p>

          <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name *</label>
              <div className="auth-input-wrap">
                <User size={16} className="auth-input-icon" />
                <input id="reg-name" name="name" type="text" className={`form-input auth-input ${errors.name ? 'error' : ''}`}
                  placeholder="Your full name" value={form.name} onChange={handleChange} autoComplete="name" />
              </div>
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">Email *</label>
                <div className="auth-input-wrap">
                  <Mail size={16} className="auth-input-icon" />
                  <input id="reg-email" name="email" type="email" className={`form-input auth-input ${errors.email ? 'error' : ''}`}
                    placeholder="your@email.com" value={form.email} onChange={handleChange} autoComplete="email" />
                </div>
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-phone">Mobile *</label>
                <div className="auth-input-wrap">
                  <Phone size={16} className="auth-input-icon" />
                  <input id="reg-phone" name="phone" type="tel" className={`form-input auth-input ${errors.phone ? 'error' : ''}`}
                    placeholder="10-digit number" value={form.phone} onChange={handleChange} maxLength={10} />
                </div>
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-role">I am a</label>
              <select id="reg-role" name="role" className="form-select" value={form.role} onChange={handleChange}>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password *</label>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input id="reg-password" name="password" type={showPwd ? 'text' : 'password'}
                  className={`form-input auth-input ${errors.password ? 'error' : ''}`}
                  placeholder="Minimum 8 characters" value={form.password} onChange={handleChange} autoComplete="new-password" />
                <button type="button" className="auth-pwd-toggle" onClick={() => setShowPwd(v => !v)} aria-label="Toggle password">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-gold auth-submit" disabled={loading}>
              {loading ? <span className="lead-form__spinner" /> : <><ArrowRight size={16} /> Create Account</>}
            </button>
          </form>

          <p className="auth-card__switch">
            Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
