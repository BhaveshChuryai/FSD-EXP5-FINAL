import { io } from 'socket.io-client'

// Connect to backend: Vite dev server proxies or connects directly to port 5000
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (
  typeof window !== 'undefined' && window.location.port === '5173'
    ? 'http://localhost:5000'
    : ''
)

let socket = null

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 8,
      reconnectionDelay: 1500,
    })
  }
  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
