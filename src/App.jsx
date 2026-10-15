import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PageLoader from './components/ui/PageLoader'

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

export default function App() {
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
            <Route path="/dashboard"        element={<Dashboard />} />
            <Route path="/admin"            element={<AdminDashboard />} />
            <Route path="*"                 element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
