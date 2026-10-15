import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setUser, setToken } from '../store/slices/authSlice'
import axios from 'axios'
import toast from 'react-hot-toast'
import './Auth.css'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: undefined }))
  }

  const validate = () => {
    const errs = {}
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Enter a valid email'
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    return errs
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const res = await axios.post('/api/auth/login', form)
      dispatch(setToken(res.data.token))
      dispatch(setUser(res.data.user))
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__bg" />
      <div className="auth-card">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="auth-card__logo">
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
              <rect x="8" y="4" width="5" height="24" fill="#D4AF37"/>
              <path d="M8 4h14a7 7 0 0 1 0 14H8" stroke="#D4AF37" strokeWidth="5" fill="none" strokeLinejoin="round"/>
              <rect x="27" y="4" width="5" height="24" fill="#D4AF37"/>
              <path d="M8 31L20 20L32 31" stroke="#D4AF37" strokeWidth="2.5" fill="none"/>
              <rect x="18" y="31" width="4" height="5" fill="#D4AF37"/>
            </svg>
            <span className="auth-card__brand">PLOTTAGE HUB</span>
          </div>

          <h1 className="auth-card__title">Welcome Back</h1>
          <p className="auth-card__subtitle">Sign in to your account to continue</p>

          <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input id="login-email" name="email" type="email" className={`form-input auth-input ${errors.email ? 'error' : ''}`}
                  placeholder="your@email.com" value={form.email} onChange={handleChange} autoComplete="email" />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input id="login-password" name="password" type={showPwd ? 'text' : 'password'}
                  className={`form-input auth-input ${errors.password ? 'error' : ''}`}
                  placeholder="Your password" value={form.password} onChange={handleChange} autoComplete="current-password" />
                <button type="button" className="auth-pwd-toggle" onClick={() => setShowPwd(v => !v)} aria-label="Toggle password">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-gold auth-submit" disabled={loading}>
              {loading ? <span className="lead-form__spinner" /> : <><ArrowRight size={16} /> Sign In</>}
            </button>
          </form>

          <p className="auth-card__switch">
            Don't have an account? <Link to="/register" className="auth-link">Create Account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
