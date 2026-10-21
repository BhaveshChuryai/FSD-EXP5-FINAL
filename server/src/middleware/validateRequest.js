import mongoose from 'mongoose'

/**
 * Validates request body, query, or params against a Zod schema.
 * @param {import('zod').ZodSchema} schema 
 * @param {'body' | 'query' | 'params'} source 
 */
export const validateRequest = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync(req[source])
      req[source] = parsed
      next()
    } catch (err) {
      if (err.errors) {
        const errors = err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        }))
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        })
      }
      next(err)
    }
  }
}

/**
 * Middleware to validate MongoDB ObjectId in route params.
 * @param {string} paramName 
 */
export const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const val = req.params[paramName]
    if (!mongoose.Types.ObjectId.isValid(val)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID parameter format: '${val}' is not a valid ObjectId`,
      })
    }
    next()
  }
}
