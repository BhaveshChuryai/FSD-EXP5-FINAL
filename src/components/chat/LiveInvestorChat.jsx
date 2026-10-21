import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Send, MessageSquare, Users, Shield, Clock, Wifi, WifiOff } from 'lucide-react'
import { getSocket } from '../../services/socket'
import './LiveInvestorChat.css'

export default function LiveInvestorChat({ className = '' }) {
  const { user, isAuthenticated } = useSelector((s) => s.auth)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [guestName, setGuestName] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [activeUsersCount, setActiveUsersCount] = useState(1)
  const [typingUser, setTypingUser] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Current display name and role
  const senderName = isAuthenticated && user?.name
    ? user.name
    : guestName.trim() || 'Guest Investor'
  const senderRole = isAuthenticated && user?.role
    ? user.role
    : 'Visitor'

  useEffect(() => {
    const socket = getSocket()

    function onConnect() {
      setIsConnected(true)
      setErrorMsg('')
      socket.emit('join_chat', { name: senderName, role: senderRole })
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    function onHistory(history) {
      if (Array.isArray(history)) {
        setMessages(history)
      }
    }

    function onReceiveMessage(msg) {
      setMessages((prev) => [...prev, msg])
      setTypingUser('')
    }

    function onUserJoined(_u) {
      setActiveUsersCount((c) => c + 1)
    }

    function onUserLeft() {
      setActiveUsersCount((c) => Math.max(1, c - 1))
    }

    function onUserTyping(data) {
      if (data?.sender && data.sender !== senderName) {
        setTypingUser(data.sender)
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = setTimeout(() => {
          setTypingUser('')
        }, 3000)
      }
    }

    function onUserStopTyping() {
      setTypingUser('')
    }

    function onError(err) {
      setErrorMsg(err.message || 'Chat error')
      setTimeout(() => setErrorMsg(''), 4000)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('chat_history', onHistory)
    socket.on('receive_message', onReceiveMessage)
    socket.on('user_joined', onUserJoined)
    socket.on('user_left', onUserLeft)
    socket.on('user_typing', onUserTyping)
    socket.on('user_stop_typing', onUserStopTyping)
    socket.on('chat_error', onError)

    if (socket.connected) {
      setIsConnected(true)
      socket.emit('join_chat', { name: senderName, role: senderRole })
    }

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('chat_history', onHistory)
      socket.off('receive_message', onReceiveMessage)
      socket.off('user_joined', onUserJoined)
      socket.off('user_left', onUserLeft)
      socket.off('user_typing', onUserTyping)
      socket.off('user_stop_typing', onUserStopTyping)
      socket.off('chat_error', onError)
    }
  }, [senderName, senderRole])

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typingUser])

  const handleSendMessage = (e) => {
    e?.preventDefault()
    const trimmed = inputText.trim()
    if (!trimmed) return

    if (trimmed.length > 500) {
      setErrorMsg('Message exceeds 500 characters.')
      return
    }

    const socket = getSocket()
    socket.emit('send_message', {
      sender: senderName,
      role: senderRole,
      text: trimmed,
    })

    socket.emit('stop_typing')
    setInputText('')
    setErrorMsg('')
  }

  const handleInputChange = (e) => {
    setInputText(e.target.value)
    const socket = getSocket()
    if (e.target.value.trim()) {
      socket.emit('typing')
    } else {
      socket.emit('stop_typing')
    }
  }

  const formatTime = (ts) => {
    if (!ts) return ''
    try {
      const d = new Date(ts)
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  return (
    <div className={`live-chat-card ${className}`}>
      {/* Header */}
      <div className="live-chat-header">
        <div className="live-chat-header__title">
          <div className="live-chat-header__icon">
            <MessageSquare size={18} color="var(--gold-primary)" />
          </div>
          <div>
            <h3>Live Investor Lounge</h3>
            <span className="live-chat-header__subtitle">
              Real-time WebSockets &bull; FSD Experiment 8
            </span>
          </div>
        </div>

        <div className="live-chat-header__status">
          {isConnected ? (
            <span className="live-chat-status live-chat-status--online" id="socket-status-online">
              <Wifi size={13} />
              <span>Live Connected</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: '6px', opacity: 0.85 }}>
                <Users size={12} /> {activeUsersCount}
              </span>
            </span>
          ) : (
            <span className="live-chat-status live-chat-status--offline" id="socket-status-offline">
              <WifiOff size={13} />
              <span>Connecting...</span>
            </span>
          )}
        </div>
      </div>

      {/* Guest Name Prompt if not signed in */}
      {!isAuthenticated && (
        <div className="live-chat-guest-bar">
          <label htmlFor="guest-name-input">Chatting as:</label>
          <input
            id="guest-name-input"
            type="text"
            placeholder="Enter your name (e.g. Rahul K.)"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            maxLength={40}
          />
        </div>
      )}

      {/* Error alert if any */}
      {errorMsg && (
        <div className="live-chat-alert">
          {errorMsg}
        </div>
      )}

      {/* Message List */}
      <div className="live-chat-messages" id="chat-messages-container">
        {messages.length === 0 ? (
          <div className="live-chat-empty">
            <Clock size={24} style={{ opacity: 0.4, marginBottom: 8 }} />
            <p>No messages yet. Send a message to start the real-time discussion!</p>
          </div>
        ) : (
          messages.map((m) => {
            const isSelf = m.sender === senderName
            const isAdmin = (m.role || '').toLowerCase() === 'admin'

            return (
              <div
                key={m.id}
                className={`chat-bubble ${isSelf ? 'chat-bubble--self' : 'chat-bubble--other'}`}
              >
                <div className="chat-bubble__meta">
                  <span className="chat-bubble__sender">{m.sender}</span>
                  {isAdmin && (
                    <span className="chat-bubble__badge chat-bubble__badge--admin">
                      <Shield size={10} style={{ marginRight: 2 }} /> Admin
                    </span>
                  )}
                  {!isAdmin && m.role && m.role !== 'Visitor' && (
                    <span className="chat-bubble__badge">{m.role}</span>
                  )}
                  <span className="chat-bubble__time">{formatTime(m.timestamp)}</span>
                </div>
                <div className="chat-bubble__text">{m.text}</div>
              </div>
            )
          })
        )}

        {typingUser && (
          <div className="chat-typing-indicator">
            <span className="chat-typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </span>
            <em>{typingUser} is typing...</em>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <form className="live-chat-footer" onSubmit={handleSendMessage}>
        <input
          id="chat-message-input"
          type="text"
          className="live-chat-input"
          placeholder="Type a real-time message to fellow investors..."
          value={inputText}
          onChange={handleInputChange}
          maxLength={500}
        />
        <button
          id="chat-send-button"
          type="submit"
          className="btn btn-gold live-chat-send-btn"
          disabled={!isConnected || !inputText.trim()}
        >
          <Send size={15} />
          <span>Send</span>
        </button>
      </form>
    </div>
  )
}
