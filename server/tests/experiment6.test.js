import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config()

import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../src/app.js'
import { connectDB, disconnectDB } from '../src/config/db.js'
import User from '../src/models/User.js'

describe('Experiment 6 — JWT Authentication & Role-Based Access Control (RBAC) Verification Suite', () => {
  let adminToken = ''
  let normalUserToken = ''
  const testUserEmail = `exp6-user-${Date.now()}@example.com`
  const testUserPassword = 'UserSecret@123'
  let registeredUserId = ''

  before(async () => {
    await connectDB()

    // 1. Verify or ensure Admin account is available
    let admin = await User.findOne({ email: 'admin@plottagehub.com' })
    if (!admin) {
      admin = new User({
        name: 'Plottage Admin',
        email: 'admin@plottagehub.com',
        phone: '9820000001',
        password: 'Admin@12345',
        role: 'Admin',
      })
      await admin.save()
    }

    const adminLoginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@plottagehub.com', password: 'Admin@12345' })

    assert.equal(adminLoginRes.status, 200, 'Admin login should succeed in before() hook')
    adminToken = adminLoginRes.body.token
    assert.ok(adminToken, 'Admin JWT token must be returned')
  })

  after(async () => {
    if (registeredUserId) {
      await User.findByIdAndDelete(registeredUserId)
    }
    await User.deleteMany({ email: /exp6-.*@example\.com/ })
    await disconnectDB()
  })

  // Test 1: Successful Registration
  it('1. Successful registration: creates new user with role "user" and returns safe user object + JWT', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Arjun Sharma',
        email: testUserEmail,
        phone: '9820123456',
        password: testUserPassword,
        role: 'user',
      })

    assert.equal(res.status, 201, 'Should return HTTP 201 Created')
    assert.equal(res.body.success, true)
    assert.ok(res.body.token, 'Should return signed JWT')
    assert.ok(res.body.user, 'Should return user profile')
    assert.equal(res.body.user.email, testUserEmail)
    assert.equal(res.body.user.role, 'user')
    assert.equal(res.body.user.password, undefined, 'Password must not be returned')

    registeredUserId = res.body.user.id
  })

  // Test 2: Duplicate Email Rejection
  it('2. Duplicate email rejection: registering with an existing email returns 409 Conflict', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Duplicate Arjun',
        email: testUserEmail,
        phone: '9820123456',
        password: testUserPassword,
      })

    assert.equal(res.status, 409, 'Should return HTTP 409 Conflict')
    assert.equal(res.body.success, false)
    assert.match(res.body.message, /already exists/i)
  })

  // Test 3: Invalid Registration Data Rejection
  it('3. Invalid registration data rejection: malformed email or short password returns 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'A',
        email: 'invalid-email-address',
        password: '123', // less than 8 characters
      })

    assert.equal(res.status, 400, 'Should return HTTP 400 Validation Error')
    assert.equal(res.body.success, false)
    assert.match(res.body.message, /Validation failed/i)
    assert.ok(Array.isArray(res.body.errors), 'Should include specific validation errors')
  })

  // Test 4: Successful Login
  it('4. Successful login: returns valid signed JWT, safe user profile, and HttpOnly session cookie', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUserEmail,
        password: testUserPassword,
      })

    assert.equal(res.status, 200, 'Should return HTTP 200 OK')
    assert.equal(res.body.success, true)
    assert.ok(res.body.token, 'JWT token must be present in body')
    assert.equal(res.body.user.email, testUserEmail)
    assert.equal(res.body.user.password, undefined)

    // Verify Set-Cookie header for browser sessions
    const cookies = res.headers['set-cookie']
    assert.ok(cookies, 'Set-Cookie header should be sent')
    assert.ok(cookies.some(c => c.startsWith('ph_token=')), 'ph_token cookie should be set')

    normalUserToken = res.body.token
  })

  // Test 5: Incorrect Password Rejection
  it('5. Incorrect password rejection: invalid password returns 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUserEmail,
        password: 'CompletelyWrongPassword!999',
      })

    assert.equal(res.status, 401, 'Should return HTTP 401 Unauthorized')
    assert.equal(res.body.success, false)
    assert.match(res.body.message, /Invalid email or password/i)
  })

  // Test 6: Protected Endpoint Without Token Returns 401
  it('6. JWT-protected endpoint without a token returns 401 Unauthorized', async () => {
    const res = await request(app).get('/api/auth/me')
    assert.equal(res.status, 401)
    assert.equal(res.body.success, false)
    assert.match(res.body.message, /Authentication required/i)
  })

  // Test 7: Invalid or Expired Token is Rejected
  it('7. Invalid or forged token is rejected with 401 Unauthorized', async () => {
    const fakeToken = jwt.sign({ id: '60c72b2f9b1d8b2bad000000', role: 'admin' }, 'wrong_secret_key')
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${fakeToken}`)

    assert.equal(res.status, 401)
    assert.equal(res.body.success, false)
    assert.match(res.body.message, /Invalid authentication token/i)
  })

  // Test 8: Normal User Cannot Access Administrator-Only Endpoint (RBAC 403)
  it('8. Normal user cannot access administrator-only endpoint GET /api/admin/dashboard (RBAC 403 Forbidden)', async () => {
    assert.ok(normalUserToken, 'Normal user token must exist')
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${normalUserToken}`)

    assert.equal(res.status, 403, 'Should return HTTP 403 Forbidden')
    assert.equal(res.body.success, false)
    assert.match(res.body.message, /Forbidden.*role/i)
  })

  // Test 9: Administrator Can Access Authorized Admin Endpoint (RBAC 200)
  it('9. Administrator can access authorized admin endpoint GET /api/admin/dashboard (RBAC 200 OK)', async () => {
    assert.ok(adminToken, 'Admin token must exist')
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`)

    assert.equal(res.status, 200, 'Should return HTTP 200 OK for admin')
    assert.equal(res.body.success, true)
    assert.ok(res.body.data.overview, 'Should return operational metrics overview')
    assert.ok(typeof res.body.data.overview.totalProperties === 'number')
    assert.ok(typeof res.body.data.overview.totalLeads === 'number')
    assert.ok(typeof res.body.data.overview.totalUsers === 'number')
  })

  // Test 10: Role Privilege Escalation Guard
  it('10. User cannot change their role to "Admin" via public registration request (Privilege escalation guard)', async () => {
    const maliciousEmail = `hacker-${Date.now()}@example.com`
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Privilege Escalation Attacker',
        email: maliciousEmail,
        phone: '9820123456',
        password: 'Password@1234',
        role: 'Admin', // Attacker attempting to assign self Admin role
      })

    assert.equal(res.status, 400, 'Should reject unauthorized role in registration')
    assert.equal(res.body.success, false)
    assert.match(res.body.message, /Validation failed/i)

    // Confirm attacker account was NOT created
    const createdUser = await User.findOne({ email: maliciousEmail })
    assert.equal(createdUser, null, 'User must not have been created in database')
  })

  // Test 11: Password Hashes Are Never Exposed
  it('11. Password hashes are never returned in registration, login, or profile payloads', async () => {
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${normalUserToken}`)

    assert.equal(meRes.status, 200)
    assert.equal(meRes.body.user.password, undefined, 'Password must not exist on /me payload')

    const dbUser = await User.findOne({ email: testUserEmail })
    assert.ok(dbUser, 'User must exist in DB')
    const userJson = dbUser.toJSON()
    assert.equal(userJson.password, undefined, 'Password must not exist in toJSON() output')
  })

  // Test 12: Logout and Session Invalidation
  it('12. POST /api/auth/logout clears the session cookie and returns success confirmation', async () => {
    const res = await request(app)
      .post('/api/auth/logout')

    assert.equal(res.status, 200)
    assert.equal(res.body.success, true)
    assert.match(res.body.message, /Logged out successfully/i)

    // Check Set-Cookie cleared
    const cookies = res.headers['set-cookie']
    assert.ok(cookies, 'Set-Cookie should be present on logout')
    assert.ok(cookies.some(c => c.includes('ph_token=;')), 'ph_token cookie must be cleared')
  })
})
