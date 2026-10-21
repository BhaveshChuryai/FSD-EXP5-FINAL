import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import PageLoader from '../ui/PageLoader'

/**
 * Route guard requiring authenticated session.
 * Preserves the intended navigation target via location state.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, sessionRestoring } = useSelector((s) => s.auth)
  const location = useLocation()

  if (sessionRestoring) {
    return <PageLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
