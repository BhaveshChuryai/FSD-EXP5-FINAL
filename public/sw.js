/**
 * Plottage Hub — Conservative Service Worker
 * Network-first strategy for static assets.
 * Strictly bypasses /api/, socket.io, and authenticated requests.
 */

const CACHE_NAME = 'plottage-hub-v1'
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/plottage-hub-logo.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(SHELL_ASSETS).catch(() => {
        // Continue even if some shell assets fail in dev
      })
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    })
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Strictly NEVER cache API requests, WebSocket upgrades, or non-GET requests
  if (
    request.method !== 'GET' ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('socket.io') ||
    url.protocol === 'ws:' ||
    url.protocol === 'wss:'
  ) {
    return
  }

  // Network-first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache valid responses for static assets
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache)
          })
        }
        return response
      })
      .catch(() => {
        // Fallback to cache if offline
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse
          if (request.mode === 'navigate') {
            return caches.match('/')
          }
          return new Response('Network offline', { status: 503, statusText: 'Service Unavailable' })
        })
      })
  )
})
