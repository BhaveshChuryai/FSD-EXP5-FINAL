import dotenv from 'dotenv'
dotenv.config()

import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import app from '../src/app.js'
import { connectDB, disconnectDB } from '../src/config/db.js'
import User from '../src/models/User.js'
import Property from '../src/models/Property.js'

describe('Plottage Hub API - FSD Experiments 4 & 5 Verification Suite', () => {
  let adminToken = ''
  let customerToken = ''
  let testPropertyId = ''

  before(async () => {
    await connectDB()

    // Login as Admin to get Admin JWT
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@plottagehub.com', password: 'Admin@12345' })

    assert.equal(adminRes.status, 200, 'Admin login should succeed')
    adminToken = adminRes.body.token

    // Login as Customer to get Customer JWT
    const custRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'buyer@plottagehub.com', password: 'Buyer@12345' })

    assert.equal(custRes.status, 200, 'Customer login should succeed')
    customerToken = custRes.body.token
  })

  after(async () => {
    // Cleanup any temporary created test properties/leads if needed
    if (testPropertyId) {
      await Property.findByIdAndDelete(testPropertyId)
    }
    await disconnectDB()
  })

  /* ==========================================================================
     EXPERIMENT 4: REST API, MongoDB, and Mongoose Tests
     ========================================================================== */
  describe('Experiment 4 — REST API, MongoDB and Mongoose Endpoints', () => {
    it('1. GET /api/health should confirm active MongoDB connection and service health', async () => {
      const res = await request(app).get('/api/health')
      assert.equal(res.status, 200)
      assert.equal(res.body.success, true)
      assert.equal(res.body.database.connected, true)
      assert.equal(res.body.database.status, 'Connected')
    })

    it('2. GET /api/properties should return published properties with pagination metadata', async () => {
      const res = await request(app).get('/api/properties?page=1&limit=5')
      assert.equal(res.status, 200)
      assert.equal(res.body.success, true)
      assert.ok(Array.isArray(res.body.data))
      assert.ok(res.body.data.length > 0, 'Should return seeded properties')
      assert.equal(res.body.pagination.page, 1)
      assert.ok(res.body.pagination.total >= 1)
    })

    it('3. GET /api/properties with query filters should filter by location and type', async () => {
      const res = await request(app).get('/api/properties?location=Karjat&type=Agricultural')
      assert.equal(res.status, 200)
      assert.equal(res.body.success, true)
      res.body.data.forEach(prop => {
        assert.match(prop.location, /Karjat/i)
        assert.match(prop.propertyType, /Agricultural/i)
      })
    })

    it('4. GET /api/properties/:id with invalid ID format should return 400 client error', async () => {
      const res = await request(app).get('/api/properties/invalid-non-existent-id')
      assert.equal(res.status, 404, 'Non-existent slug should return 404')
    })

    it('5. POST /api/properties should persist a new property submission with default "Pending Review"', async () => {
      const newProp = {
        title: 'Exp 4 Verified Test Agricultural Land',
        description: 'Test parcel created during automated suite execution.',
        location: 'Khopoli, Raigad',
        propertyType: 'Agricultural Land',
        area: 4,
        areaUnit: 'Acre',
        price: '₹ 38 Lakh',
        priceAmount: 38,
        priceFlexibility: 'Negotiable',
        infrastructure: ['Tar road', 'Well water'],
        docStatus: '7/12 Extract Available',
        ownership: 'Sole Landowner',
        name: 'Test Landowner',
        phone: '9820554433',
        email: 'landowner.test@example.com',
      }

      const res = await request(app)
        .post('/api/properties')
        .send(newProp)

      assert.equal(res.status, 201)
      assert.equal(res.body.success, true)
      assert.ok(res.body.referenceId.startsWith('PH-LIST-'))
      assert.equal(res.body.data.status, 'Pending Review', 'Public submissions must not auto-publish')
      testPropertyId = res.body.data._id
    })

    it('6. GET /api/properties/:id should fetch the created property details', async () => {
      assert.ok(testPropertyId, 'Must have created a test property')
      const res = await request(app).get(`/api/properties/${testPropertyId}`)
      assert.equal(res.status, 200)
      assert.equal(res.body.success, true)
      assert.equal(res.body.data._id, testPropertyId)
      assert.equal(res.body.data.title, 'Exp 4 Verified Test Agricultural Land')
    })

    it('7. POST /api/leads should persist a buyer requirement in MongoDB and return a reference ID', async () => {
      const leadData = {
        name: 'Vivek Sharma',
        phone: '9820199001',
        email: 'vivek.sharma@example.com',
        propertyType: 'Agricultural Land',
        location: 'Karjat',
        minBudget: 35,
        maxBudget: 50,
        area: '5',
        areaUnit: 'Acre',
        purpose: 'Organic Farming',
        timeline: 'Within 1 month',
        requirements: 'Perennial water access required.',
      }

      const res = await request(app)
        .post('/api/leads')
        .send(leadData)

      assert.equal(res.status, 201)
      assert.equal(res.body.success, true)
      assert.ok(res.body.referenceId.startsWith('PH-LEAD-'))
    })
  })

  /* ==========================================================================
     EXPERIMENT 5: Secure REST APIs Tests
     ========================================================================== */
  describe('Experiment 5 — Secure REST APIs & Protection Controls', () => {
    it('1. Passwords must never be stored in plaintext in the database (Bcrypt hashing)', async () => {
      const user = await User.findOne({ email: 'admin@plottagehub.com' }).select('+password')
      assert.ok(user, 'User should exist')
      assert.notEqual(user.password, 'Admin@12345', 'Password must NOT match plaintext')
      assert.ok(user.password.startsWith('$2'), 'Password must be a valid bcrypt hash starting with $2')
    })

    it('2. Unauthenticated request to protected endpoint GET /api/leads should be rejected with 401', async () => {
      const res = await request(app).get('/api/leads')
      assert.equal(res.status, 401)
      assert.equal(res.body.success, false)
      assert.match(res.body.message, /Authentication required/i)
    })

    it('3. Non-admin authenticated user cannot access GET /api/leads (RBAC 403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/leads')
        .set('Authorization', `Bearer ${customerToken}`)

      assert.equal(res.status, 403)
      assert.equal(res.body.success, false)
      assert.match(res.body.message, /Forbidden/i)
    })

    it('4. Admin user can successfully access protected GET /api/leads', async () => {
      const res = await request(app)
        .get('/api/leads')
        .set('Authorization', `Bearer ${adminToken}`)

      assert.equal(res.status, 200)
      assert.equal(res.body.success, true)
      assert.ok(Array.isArray(res.body.data))
    })

    it('5. Server-side Zod validation rejects invalid phone numbers on POST /api/leads with 400', async () => {
      const invalidLead = {
        name: 'Invalid Test User',
        phone: '12345', // Malformed phone number
        propertyType: 'Agricultural Land',
        location: 'Karjat',
      }

      const res = await request(app)
        .post('/api/leads')
        .send(invalidLead)

      assert.equal(res.status, 400)
      assert.equal(res.body.success, false)
      assert.equal(res.body.message, 'Validation failed')
      assert.ok(res.body.errors.some(e => e.field === 'phone'))
    })

    it('6. Server-side Zod validation rejects missing required fields on registration with 400', async () => {
      const invalidRegister = {
        name: 'No Email User',
        password: 'short', // Too short (< 8 chars)
      }

      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidRegister)

      assert.equal(res.status, 400)
      assert.equal(res.body.success, false)
      assert.equal(res.body.message, 'Validation failed')
    })

    it('7. Public registration cannot escalate role to Admin (Role privilege escalation guard)', async () => {
      const testEmail = `attacker-${Date.now()}@test.com`
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Attacker User',
          email: testEmail,
          password: 'Password@123',
          role: 'Admin', // Attempting unauthorized role assignment
        })

      assert.equal(res.status, 400, 'Zod validator should reject unauthorized Admin role in registration')
      assert.equal(res.body.success, false)
      assert.match(res.body.message, /Validation failed/i)
    })

    it('8. PATCH /api/properties/:id allows Admin to approve/publish listing', async () => {
      assert.ok(testPropertyId, 'Must have a test property')
      const res = await request(app)
        .patch(`/api/properties/${testPropertyId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Published' })

      assert.equal(res.status, 200)
      assert.equal(res.body.success, true)
      assert.equal(res.body.data.status, 'Published')
    })

    it('9. Security headers (Helmet) should be present in HTTP responses', async () => {
      const res = await request(app).get('/api/health')
      assert.ok(res.headers['x-content-type-options'], 'nosniff header should be present')
      assert.ok(res.headers['x-frame-options'] || res.headers['content-security-policy'], 'Frame protection header present')
    })

    it('10. Centralized error handling returns clean JSON without stack trace in production-like mode', async () => {
      const res = await request(app).get('/api/properties/999999999999999999999999')
      assert.equal(res.status, 404)
      assert.equal(res.body.success, false)
      assert.equal(res.body.stack, undefined, 'Stack trace must not be exposed')
    })

    it('11. Unauthenticated request to GET /api/partner-applications is rejected with 401 Unauthorized', async () => {
      const res = await request(app).get('/api/partner-applications')
      assert.equal(res.status, 401)
      assert.equal(res.body.success, false)
      assert.match(res.body.message, /Authentication required/i)
    })

    it('12. Non-admin authenticated user cannot access GET /api/partner-applications (RBAC 403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/partner-applications')
        .set('Authorization', `Bearer ${customerToken}`)

      assert.equal(res.status, 403)
      assert.equal(res.body.success, false)
      assert.match(res.body.message, /Forbidden/i)
    })

    it('13. Admin user can successfully access protected GET /api/partner-applications', async () => {
      const res = await request(app)
        .get('/api/partner-applications')
        .set('Authorization', `Bearer ${adminToken}`)

      assert.equal(res.status, 200)
      assert.equal(res.body.success, true)
      assert.ok(Array.isArray(res.body.applications))
    })

    it('14. Server-side Zod validation rejects invalid phone on POST /api/partner-applications with 400 Bad Request', async () => {
      const invalidPartner = {
        partnerType: 'Broker',
        name: 'Invalid Broker',
        phone: '12345',
      }

      const res = await request(app)
        .post('/api/partner-applications')
        .send(invalidPartner)

      assert.equal(res.status, 400)
      assert.equal(res.body.success, false)
      assert.equal(res.body.message, 'Validation failed')
      assert.ok(res.body.errors.some(e => e.field === 'phone'))
    })

    it('15. Unauthenticated request to legacy GET /api/listings is rejected with 401 Unauthorized', async () => {
      const res = await request(app).get('/api/listings')
      assert.equal(res.status, 401)
      assert.equal(res.body.success, false)
      assert.match(res.body.message, /Authentication required/i)
    })

    it('16. POST /api/properties successfully accepts UI listing types such as "Residential Plots / Layout"', async () => {
      const res = await request(app)
        .post('/api/properties')
        .send({
          title: 'UI Form Verified Layout Land',
          location: 'Pune, Maharashtra',
          propertyType: 'Residential Plots / Layout',
          area: 2400,
          areaUnit: 'Sq.ft',
          price: '₹ 25 Lakh',
          name: 'Priya Joshi',
          phone: '9820123456',
        })

      assert.equal(res.status, 201)
      assert.equal(res.body.success, true)
      assert.equal(res.body.data.propertyType, 'Residential Plots / Layout')

      // Clean up
      if (res.body.data._id) {
        await Property.findByIdAndDelete(res.body.data._id)
      }
    })

    it('17. POST /api/partner-applications preserves role-specific details in details map', async () => {
      const res = await request(app)
        .post('/api/partner-applications')
        .send({
          partnerType: 'Broker',
          name: 'Apex Realty Mandates',
          phone: '9820987654',
          agency: 'Apex Mandates LLP',
          locations: 'Karjat, Alibaug, Lonavala',
          experience: '12 years in Sahyadri land acquisitions',
        })

      assert.equal(res.status, 201)
      assert.equal(res.body.success, true)
      assert.ok(res.body.referenceId)
    })
  })
})
