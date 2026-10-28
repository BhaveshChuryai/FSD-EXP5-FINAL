import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config()

import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { io as ClientIO } from 'socket.io-client'
import app from '../src/app.js'
import { setupChatSocket } from '../src/sockets/chatSocket.js'

describe('Experiment 8 — Real-Time Communication with WebSockets / Socket.IO', () => {
  let server
  let port
  let clientSocketA
  let clientSocketB

  before(async () => {
    return new Promise((resolve) => {
      server = http.createServer(app)
      const io = new SocketIOServer(server, {
        cors: { origin: '*' },
      })
      setupChatSocket(io)

      server.listen(0, () => {
        port = server.address().port
        resolve()
      })
    })
  })

  after(async () => {
    if (clientSocketA?.connected) clientSocketA.disconnect()
    if (clientSocketB?.connected) clientSocketB.disconnect()
    return new Promise((resolve) => server.close(resolve))
  })

  it('1. Should establish WebSocket connection and receive initial chat_history', async () => {
    return new Promise((resolve) => {
      clientSocketA = ClientIO(`http://127.0.0.1:${port}`, {
        transports: ['websocket'],
        forceNew: true,
      })

      clientSocketA.on('chat_history', (history) => {
        assert.ok(Array.isArray(history), 'History should be an array')
        assert.ok(history.length >= 1, 'Should contain welcome message')
        assert.equal(history[0].sender, 'Plottage Concierge')
        resolve()
      })
    })
  })

  it('2. Should broadcast a message from Client A and deliver instantly to Client B without refresh', async () => {
    return new Promise((resolve) => {
      clientSocketB = ClientIO(`http://127.0.0.1:${port}`, {
        transports: ['websocket'],
        forceNew: true,
      })

      const testMessageText = `Exp 8 Land Valuation Query ${Date.now()}`

      clientSocketB.on('connect', () => {
        clientSocketB.on('receive_message', (msg) => {
          if (msg.text === testMessageText) {
            assert.equal(msg.sender, 'Investor Alpha')
            assert.equal(msg.role, 'Buyer')
            assert.equal(msg.text, testMessageText)
            assert.ok(msg.id.startsWith('msg-'), 'Message should have unique ID')
            assert.ok(msg.timestamp, 'Message should have ISO timestamp')
            resolve()
          }
        })

        clientSocketA.emit('send_message', {
          sender: 'Investor Alpha',
          role: 'Buyer',
          text: testMessageText,
        })
      })
    })
  })

  it('3. Should validate message text and reject empty payload with chat_error event', async () => {
    return new Promise((resolve) => {
      clientSocketA.once('chat_error', (err) => {
        assert.ok(err.message, 'Should return error message')
        assert.match(err.message, /cannot be empty/i)
        resolve()
      })

      clientSocketA.emit('send_message', {
        sender: 'Investor Alpha',
        text: '   ',
      })
    })
  })

  it('4. Should validate message length and reject message exceeding 500 characters', async () => {
    return new Promise((resolve) => {
      clientSocketA.once('chat_error', (err) => {
        assert.ok(err.message)
        assert.match(err.message, /exceeds maximum allowed length/i)
        resolve()
      })

      clientSocketA.emit('send_message', {
        sender: 'Investor Alpha',
        text: 'A'.repeat(501),
      })
    })
  })

  it('5. Should broadcast two-way replies (Client B sends, Client A receives)', async () => {
    return new Promise((resolve) => {
      const replyText = `Reply from Client B ${Date.now()}`

      clientSocketA.on('receive_message', (msg) => {
        if (msg.text === replyText) {
          assert.equal(msg.sender, 'Investor Beta')
          assert.equal(msg.text, replyText)
          resolve()
        }
      })

      clientSocketB.emit('send_message', {
        sender: 'Investor Beta',
        role: 'Landowner',
        text: replyText,
      })
    })
  })
})
