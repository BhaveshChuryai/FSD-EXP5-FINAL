import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PageLoader from './components/ui/PageLoader'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'
import { fetchCurrentUser } from './store/slices/authSlice'

// Lazy-loaded pages
const Home            = lazy(() => import('./pages/Home'))
const ExploreLand     = lazy(() => import('./pages/ExploreLand'))
const PropertyDetail  = lazy(() => import('./pages/PropertyDetail'))
const PartnerWithUs   = lazy(() => import('./pages/PartnerWithUs'))
const Community       = lazy(() => import('./pages/Community'))
const Login           = lazy(() => import('./pages/Login'))
const Register        = lazy(() => import('./pages/Register'))
const Dashboard       = lazy(() => import('./pages/Dashboard'))
const AdminDashboard  = lazy(() => import('./pages/AdminDashboard'))
const ListLand        = lazy(() => import('./pages/ListLand'))
const NotFound        = lazy(() => import('./pages/NotFound'))
const PrivacyPolicy   = lazy(() => import('./pages/PrivacyPolicy'))
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'))

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Restore and validate session token with backend if present
    const token = localStorage.getItem('ph_token')
    if (token) {
      dispatch(fetchCurrentUser())
    }
  }, [dispatch])

  return (
    <div className="app">
      <Navbar />
      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"                 element={<Home />} />
            <Route path="/explore"          element={<ExploreLand />} />
            <Route path="/property/:id"     element={<PropertyDetail />} />
            <Route path="/partner"          element={<PartnerWithUs />} />
            <Route path="/list-land"        element={<ListLand />} />
            <Route path="/community"        element={<Community />} />
            <Route path="/login"            element={<Login />} />
            <Route path="/register"         element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route path="/privacy"            element={<PrivacyPolicy />} />
            <Route path="/terms"              element={<TermsAndConditions />} />
            <Route path="*"                 element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
