import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config()

import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import http from 'http'
import jwt from 'jsonwebtoken'
import { Server as SocketIOServer } from 'socket.io'
import { io as ClientIO } from 'socket.io-client'
import app from '../src/app.js'
import { setupChatSocket } from '../src/sockets/chatSocket.js'
import Lead from '../src/models/Lead.js'

describe('Plottage Hub Finalization — Admin Real-Time & Lead Lifecycle Suite', () => {
  let server
  let port
  let adminSocket
  let normalSocket
  let adminToken
  let userToken
  const jwtSecret = process.env.JWT_SECRET || '7f2a9c6e4b1d8f03a5c7e9b2d6f1a4c8e0b3d7f9a2c5e6b1d4f8a0c3e7b9d2f6'

  before(async () => {
    adminToken = jwt.sign({ id: 'admin1', role: 'admin', email: 'admin@plottage.com' }, jwtSecret, { expiresIn: '1h' })
    userToken = jwt.sign({ id: 'user1', role: 'user', email: 'user@plottage.com' }, jwtSecret, { expiresIn: '1h' })

    return new Promise((resolve) => {
      server = http.createServer(app)
      const io = new SocketIOServer(server, { cors: { origin: '*' } })
      setupChatSocket(io)
      app.locals.io = io

      server.listen(0, () => {
        port = server.address().port
        resolve()
      })
    })
  })

  after(async () => {
    if (adminSocket?.connected) adminSocket.disconnect()
    if (normalSocket?.connected) normalSocket.disconnect()
    return new Promise((resolve) => server.close(resolve))
  })

  it('1. Admin can successfully join the admin notification room with valid JWT', async () => {
    return new Promise((resolve, reject) => {
      adminSocket = ClientIO(`http://127.0.0.1:${port}`, { transports: ['websocket'], forceNew: true })

      adminSocket.on('admin_room_joined', (res) => {
        assert.equal(res.success, true)
        resolve()
      })

      adminSocket.on('admin_auth_error', (err) => {
        reject(new Error(err.message))
      })

      adminSocket.emit('join_admin_room', { token: adminToken })
    })
  })

  it('2. Non-admin user is rejected when attempting to join admin notification room', async () => {
    return new Promise((resolve) => {
      normalSocket = ClientIO(`http://127.0.0.1:${port}`, { transports: ['websocket'], forceNew: true })

      normalSocket.on('admin_auth_error', (err) => {
        assert.match(err.message, /Access denied|required/i)
        resolve()
      })

      normalSocket.emit('join_admin_room', { token: userToken })
    })
  })

  it('3. Lead model supports all 5 lifecycle statuses', () => {
    const validStatuses = ['New', 'Contacted', 'Qualified', 'Visit Scheduled', 'Closed', 'Lost']
    const enumValues = Lead.schema.path('status').enumValues
    for (const st of validStatuses) {
      assert.ok(enumValues.includes(st), `Lead schema enum should include '${st}'`)
    }
  })
})
