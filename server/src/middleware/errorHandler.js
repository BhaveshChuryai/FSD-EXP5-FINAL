/**
 * Centralized Error Handling Middleware for Plottage Hub Express Backend.
 * Standardizes all error responses and prevents sensitive information leakage.
 */
export const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'
  let errors = err.errors || undefined

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400
    message = `Resource not found. Invalid ID format for field '${err.path}'`
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = 'Database validation failed'
    errors = Object.values(err.errors).map(val => ({
      field: val.path,
      message: val.message,
    }))
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 409
    const duplicateField = Object.keys(err.keyValue || {})[0] || 'field'
    message = `Duplicate entry: A record with that ${duplicateField} already exists.`
  }

  // Handle JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid authentication token.'
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Authentication token expired.'
  }

  // Avoid leaking server internals or database connection strings
  const isProd = process.env.NODE_ENV === 'production'

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(!isProd && statusCode === 500 && { stack: err.stack }),
  })
}

// 404 handler for undefined API routes
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.method} ${req.originalUrl}' not found.`,
  })
}
