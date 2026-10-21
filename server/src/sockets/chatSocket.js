/**
 * Real-Time Community Chat Socket Handler (FSD Experiment 8)
 * Manages WebSocket connections, message broadcast, and in-memory history.
 */

const MAX_HISTORY = 50
const MAX_MESSAGE_LENGTH = 500
const MAX_NAME_LENGTH = 50

// In-memory message store for real-time demonstration
const recentMessages = [
  {
    id: 'msg-init-1',
    sender: 'Plottage Concierge',
    role: 'Admin',
    text: 'Welcome to the Plottage Hub Live Investor Lounge! Ask questions about prime Maharashtra land parcels, 7/12 extracts, or connect with fellow investors.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
]

export function setupChatSocket(io) {
  io.on('connection', (socket) => {
    let currentUser = {
      name: 'Guest Investor',
      role: 'Visitor',
    }

    console.log(`🔌 [Socket.IO] Client connected: ${socket.id}`)

    // 1. Send recent history to newly connected client
    socket.emit('chat_history', recentMessages)

    // 2. Client joins with identity (e.g. from user profile or guest name)
    socket.on('join_chat', (userData) => {
      if (userData && typeof userData === 'object') {
        const cleanName = (userData.name || 'Guest Investor').trim().slice(0, MAX_NAME_LENGTH)
        const cleanRole = (userData.role || 'Visitor').trim().slice(0, 30)
        currentUser = {
          name: cleanName || 'Guest Investor',
          role: cleanRole || 'Visitor',
        }
      }
      console.log(`👤 [Socket.IO] ${currentUser.name} (${currentUser.role}) joined chat on ${socket.id}`)
      socket.broadcast.emit('user_joined', {
        name: currentUser.name,
        role: currentUser.role,
        timestamp: new Date().toISOString(),
      })
    })

    // 3. Handle sending real-time messages
    socket.on('send_message', (data) => {
      if (!data || typeof data !== 'object') {
        return socket.emit('chat_error', { message: 'Invalid message payload.' })
      }

      const text = (data.text || '').trim()
      if (!text || text.length === 0) {
        return socket.emit('chat_error', { message: 'Message text cannot be empty.' })
      }

      if (text.length > MAX_MESSAGE_LENGTH) {
        return socket.emit('chat_error', {
          message: `Message exceeds maximum allowed length of ${MAX_MESSAGE_LENGTH} characters.`,
        })
      }

      const senderName = (data.sender || currentUser.name || 'Guest Investor').trim().slice(0, MAX_NAME_LENGTH)
      const senderRole = (data.role || currentUser.role || 'Visitor').trim().slice(0, 30)

      const message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sender: senderName,
        role: senderRole,
        text,
        timestamp: new Date().toISOString(),
      }

      // Add to in-memory history (keeping latest 50 messages)
      recentMessages.push(message)
      if (recentMessages.length > MAX_HISTORY) {
        recentMessages.shift()
      }

      // Broadcast to ALL connected clients including the sender
      io.emit('receive_message', message)
      console.log(`💬 [Socket.IO] Broadcast message from ${message.sender}: "${message.text.slice(0, 30)}..."`)
    })

    // 4. Typing indicator micro-interactions
    socket.on('typing', () => {
      socket.broadcast.emit('user_typing', { sender: currentUser.name })
    })

    socket.on('stop_typing', () => {
      socket.broadcast.emit('user_stop_typing', { sender: currentUser.name })
    })

    // 5. Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`🔌 [Socket.IO] Client disconnected: ${socket.id} (${reason})`)
      socket.broadcast.emit('user_left', {
        name: currentUser.name,
        timestamp: new Date().toISOString(),
      })
    })
  })
}
