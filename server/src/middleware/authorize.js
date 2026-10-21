/**
 * Role-Based Access Control middleware.
 * Verifies that the authenticated user possesses one of the required roles.
 * @param  {...string} roles Allowed roles (e.g. 'Admin', 'Broker', etc.)
 */
export const authorize = (...roles) => {
  const normalizedRequiredRoles = roles.map(r => r.toLowerCase())

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required prior to authorization check.',
      })
    }

    const currentRole = (req.user.role || '').toLowerCase()
    const isAdmin = currentRole === 'admin'
    const isAllowed =
      isAdmin ||
      normalizedRequiredRoles.includes(currentRole) ||
      (currentRole === 'customer' && normalizedRequiredRoles.includes('user')) ||
      (currentRole === 'user' && normalizedRequiredRoles.includes('customer'))

    if (!isAllowed) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of [${roles.join(', ')}] role. Current role is '${req.user.role}'.`,
      })
    }

    next()
  }
}
