import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

function plottageApiPlugin() {
  const dbPath = path.resolve(process.cwd(), 'data', 'db.json')

  const readDb = () => {
    try {
      if (!fs.existsSync(dbPath)) {
        const init = { listings: [], partnerApplications: [], leads: [] }
        fs.mkdirSync(path.dirname(dbPath), { recursive: true })
        fs.writeFileSync(dbPath, JSON.stringify(init, null, 2), 'utf-8')
        return init
      }
      return JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
    } catch {
      return { listings: [], partnerApplications: [], leads: [] }
    }
  }

  const writeDb = (data) => {
    try {
      fs.mkdirSync(path.dirname(dbPath), { recursive: true })
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (err) {
      console.error('Failed to write db.json:', err)
    }
  }

  return {
    name: 'plottage-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next()

        // Helper to parse JSON body
        const getBody = () => new Promise((resolve) => {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              resolve(body ? JSON.parse(body) : {})
            } catch {
              resolve({})
            }
          })
        })

        const sendJson = (status, data) => {
          res.writeHead(status, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify(data))
        }

        // POST /api/listings
        if (req.url === '/api/listings' && req.method === 'POST') {
          return getBody().then(payload => {
            if (!payload.name || !payload.phone || !payload.title || !payload.location) {
              return sendJson(400, { error: 'Missing required fields for property submission' })
            }
            const db = readDb()
            const id = 'PH-LIST-' + Date.now().toString().slice(-6)
            const newListing = {
              id,
              ...payload,
              status: 'Pending Review',
              createdAt: new Date().toISOString()
            }
            db.listings = db.listings || []
            db.listings.unshift(newListing)
            writeDb(db)
            return sendJson(201, {
              success: true,
              referenceId: id,
              listing: newListing,
              message: 'Your property has been submitted for review.'
            })
          })
        }

        // GET /api/listings
        if (req.url === '/api/listings' && req.method === 'GET') {
          const db = readDb()
          return sendJson(200, { listings: db.listings || [] })
        }

        // POST /api/partner-applications
        if (req.url === '/api/partner-applications' && req.method === 'POST') {
          return getBody().then(payload => {
            if (!payload.name || !payload.phone) {
              return sendJson(400, { error: 'Name and Phone are required' })
            }
            const db = readDb()
            const id = 'PH-APP-' + Date.now().toString().slice(-6)
            const newApp = {
              id,
              ...payload,
              status: 'Pending Review',
              createdAt: new Date().toISOString()
            }
            db.partnerApplications = db.partnerApplications || []
            db.partnerApplications.unshift(newApp)
            writeDb(db)
            return sendJson(201, {
              success: true,
              referenceId: id,
              message: 'Partner application submitted successfully.'
            })
          })
        }

        // GET /api/partner-applications
        if (req.url === '/api/partner-applications' && req.method === 'GET') {
          const db = readDb()
          return sendJson(200, { applications: db.partnerApplications || [] })
        }

        // POST /api/leads
        if (req.url === '/api/leads' && req.method === 'POST') {
          return getBody().then(payload => {
            const db = readDb()
            const id = 'PH-LEAD-' + Date.now().toString().slice(-6)
            const newLead = {
              id,
              ...payload,
              status: 'New',
              createdAt: new Date().toISOString()
            }
            db.leads = db.leads || []
            db.leads.unshift(newLead)
            writeDb(db)
            return sendJson(201, { success: true, referenceId: id })
          })
        }

        // POST /api/auth/login
        if (req.url === '/api/auth/login' && req.method === 'POST') {
          return getBody().then(payload => {
            return sendJson(200, {
              token: 'ph-auth-token-' + Date.now(),
              user: {
                id: 'usr-1',
                email: payload.email || 'investor@plottagehub.com',
                name: payload.email?.split('@')[0] || 'Investor Member',
                role: 'Investor'
              }
            })
          })
        }

        // POST /api/auth/register
        if (req.url === '/api/auth/register' && req.method === 'POST') {
          return getBody().then(payload => {
            return sendJson(201, {
              token: 'ph-auth-token-' + Date.now(),
              user: {
                id: 'usr-' + Date.now(),
                name: payload.name || 'New Member',
                email: payload.email,
                phone: payload.phone,
                role: payload.role || 'Buyer'
              }
            })
          })
        }

        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ...(process.env.VITE_USE_MOCK_PLUGIN === 'true' ? [plottageApiPlugin()] : []),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://127.0.0.1:5000',
        ws: true,
        changeOrigin: true,
      },
    },
  },
})
