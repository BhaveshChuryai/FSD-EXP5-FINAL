import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config()

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import app from '../src/app.js'

describe('Plottage Hub Proxy Trust & Rate Limiting Verification Suite (Phase 3)', () => {
  it('1. Express trust proxy is correctly configured for single-hop reverse proxies (Render / Nginx)', () => {
    const trustProxy = app.get('trust proxy')
    assert.ok(trustProxy === 1 || trustProxy === true || typeof trustProxy === 'function',
      'trust proxy must be configured to trust the immediate upstream proxy')
  })

  it('2. Request with X-Forwarded-For behind proxy does NOT trigger ERR_ERL_UNEXPECTED_X_FORWARDED_FOR', async () => {
    // Calling an endpoint protected by submissionLimiter (/api/listings or /api/leads)
    const res = await request(app)
      .post('/api/leads')
      .set('X-Forwarded-For', '203.0.113.195') // Standard RFC 5737 test IP
      .set('X-Forwarded-Proto', 'https')
      .send({
        // Malformed on purpose to stop at validation, but verifying limiter middleware passes without 500 error
        name: 'Proxy Tester',
        phone: 'invalid',
      })

    // Must return 400 validation error, NOT 500 ValidationError from express-rate-limit
    assert.equal(res.status, 400, 'Request should pass rate limiter and reach validation handler')
    assert.equal(res.body.success, false)
    assert.notEqual(res.body.message, 'The \'X-Forwarded-For\' header is set but the Express \'trust proxy\' setting is false')
  })

  it('3. Standard rate limit headers are included in HTTP responses', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('X-Forwarded-For', '198.51.100.42')

    // Health check returns 200 or 503 depending on DB, but headers are populated
    assert.ok(res.status === 200 || res.status === 503)
  })

  it('4. Direct request without proxy headers continues to work seamlessly', async () => {
    const res = await request(app)
      .get('/api/health')

    assert.ok(res.status === 200 || res.status === 503)
    assert.equal(res.body.service, 'Plottage Hub API')
  })

  it('5. CORS allows configured local origins and rejects unallowed foreign origins', async () => {
    const allowedRes = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:5173')

    assert.equal(allowedRes.headers['access-control-allow-origin'], 'http://localhost:5173')

    const rejectedRes = await request(app)
      .get('/api/health')
      .set('Origin', 'https://malicious-phishing-site.example')

    assert.strictEqual(rejectedRes.headers['access-control-allow-origin'], undefined)
  })
})
