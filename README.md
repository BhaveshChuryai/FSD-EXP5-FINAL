# 🏛️ Plottage Hub — Discover Land. Unlock Possibilities.

[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20_LTS-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8.12-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose_v2-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![JWT](https://img.shields.io/badge/JWT-RBAC_Secured-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

> **Full Stack Development (FSD) Practical Examination Project**  
> **Experiments 4, 5, 6 & 7 Complete Implementation**  
> **Plottage Hub** is a luxury PropTech platform for discovering, evaluating, and transacting prime land opportunities across Maharashtra, India. It combines a high-performance React 19 frontend with a robust, production-conscious Node.js/Express REST API backed by MongoDB, comprehensive JWT authentication with Role-Based Access Control (RBAC), and containerization via multi-stage Docker builds and Docker Compose.

---

## 📚 College FSD Syllabus Mapping

| Experiment | Title | Core Technical Implementations |
| :--- | :--- | :--- |
| **FSD Experiment 4** | **REST API + MongoDB + Mongoose** | Dedicated MongoDB connection module, connection pooling, graceful shutdown, Mongoose schemas (`Property`, `Lead`, `User`, `PartnerApplication`), full CRUD REST endpoints, query filtering & pagination, seed utility, centralized frontend API service. |
| **FSD Experiment 5** | **Secure REST APIs** | Server-side validation via **Zod**, password hashing via **Bcrypt** (salt rounds 10), stateless session management via **JSON Web Tokens (JWT)**, Role-Based Access Control (**RBAC**), rate limiting with **express-rate-limit**, HTTP hardening with **Helmet**, origin-restricted **CORS**, safe query parsing, centralized error handling without stack trace leakage. |
| **FSD Experiment 6** | **JWT Authentication & User Roles (RBAC)** | Two-role access model (`user` and `admin`), secure registration and login, password hashing with zero hash exposure, privilege escalation guard (preventing public admin registration), dedicated administrator bootstrap script, dual credential delivery (HttpOnly cookies + Authorization Bearer header), protected frontend route guards (`ProtectedRoute`, `AdminRoute` with 403 Forbidden screen), session restoration on page reload, automated 12-test verification suite. |
| **FSD Experiment 7** | **Dockerization & Docker Compose** | Multi-stage frontend Dockerfile (Vite build + production Nginx Alpine), SPA client-side routing fallback (`try_files $uri $uri/ /index.html`), same-origin reverse-proxy (`/api` -> backend:5000), backend production Dockerfile (Node.js LTS, non-root user `USER node`, health check), Docker Compose (`compose.yaml`) orchestrating `frontend`, `backend`, and `mongodb` with persistent named volume (`mongodb_data`), health-dependent service startup, zero exposed secrets. |

---

## 🏗️ Architecture & Directory Layout

```
fsd/
├── compose.yaml                   # Experiment 7: Multi-service Docker Compose specification
├── Dockerfile                     # Experiment 7: Frontend multi-stage Nginx build
├── nginx.conf                     # Experiment 7: Nginx reverse-proxy & SPA fallback configuration
├── .dockerignore                  # Experiment 7: Root build context exclusions
├── .env.example                   # Client-side environment template
├── data/
│   └── db.json                    # Demonstration / offline fallback records
├── public/                        # Static brand assets & logo
│   └── assets/
├── server/                        # Isolated Express REST API Backend
│   ├── Dockerfile                 # Experiment 7: Backend Node LTS production image
│   ├── .dockerignore              # Experiment 7: Backend build context exclusions
│   ├── .env.example               # Backend environment template with admin bootstrap variables
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Dedicated MongoDB connection module
│   │   ├── controllers/
│   │   │   ├── authController.js  # Register, login, logout, getMe, getAdminDashboard
│   │   │   ├── leadController.js  # Buyer requirement enquiries
│   │   │   ├── partnerController.js # Partner applications
│   │   │   └── propertyController.js # Land parcel CRUD & admin listings
│   │   ├── middleware/
│   │   │   ├── authenticate.js    # JWT verification (Bearer header + HttpOnly cookie)
│   │   │   ├── authorize.js       # Role-based access control (RBAC: user / admin)
│   │   │   ├── errorHandler.js    # Centralized JSON error handler
│   │   │   ├── rateLimiter.js     # IP rate limiters (auth, forms, API)
│   │   │   └── validateRequest.js # Zod schema & ObjectId validation
│   │   ├── models/
│   │   │   ├── Lead.js            # Mongoose buyer lead schema
│   │   │   ├── PartnerApplication.js # Mongoose partner application schema
│   │   │   ├── Property.js        # Mongoose property parcel schema
│   │   │   └── User.js            # Mongoose user schema with Bcrypt hook & toJSON transform
│   │   ├── routes/
│   │   │   ├── authRoutes.js      # /api/auth (register, login, me, logout)
│   │   │   ├── leadRoutes.js      # /api/leads & /api/enquiries
│   │   │   ├── partnerRoutes.js   # /api/partner-applications
│   │   │   └── propertyRoutes.js  # /api/properties & /api/listings
│   │   ├── scripts/
│   │   │   └── bootstrapAdmin.js  # Experiment 6: Dedicated administrator bootstrap script
│   │   ├── validators/
│   │   │   ├── authValidator.js   # Zod schemas for register (strict role guard) and login
│   │   │   ├── leadValidator.js   # Zod schemas for leads
│   │   │   └── propertyValidator.js # Zod schemas for property submissions
│   │   ├── app.js                 # Express application configuration & route mounting
│   │   ├── seed.js                # Database seeding utility
│   │   └── server.js              # Server entry point with graceful shutdown
│   ├── tests/
│   │   ├── api.test.js            # Experiments 4 & 5 verification suite (17 tests)
│   │   └── experiment6.test.js    # Experiment 6 verification suite (12 tests)
│   └── package.json               # Backend dependencies and test runners
├── src/                           # React 19 Frontend SPA
│   ├── components/
│   │   ├── auth/
│   │   │   ├── ProtectedRoute.jsx # Experiment 6: Route guard requiring active session
│   │   │   └── AdminRoute.jsx     # Experiment 6: Route guard requiring Admin role (403 view)
│   │   ├── home/                  # Hero, FeaturedProperties, WhySection, LeadForm
│   │   ├── layout/                # Navbar (with user dropdown & Admin portal), Footer
│   │   └── ui/                    # PageLoader, SuccessModal, buttons, badges
│   ├── pages/
│   │   ├── Home.jsx               # Landing page
│   │   ├── ExploreLand.jsx        # Land discovery catalog
│   │   ├── PropertyDetail.jsx     # Individual parcel page with enquiry modal
│   │   ├── Dashboard.jsx          # Protected user dashboard
│   │   ├── AdminDashboard.jsx     # Protected admin dashboard (metrics & approvals)
│   │   ├── Login.jsx              # Connected sign-in page
│   │   └── Register.jsx           # Connected sign-up page (public role: user)
│   ├── services/
│   │   └── api.js                 # Centralized Axios client (with token interceptor & authAPI)
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.js       # User state, JWT storage, session restoration thunks
│   │   │   ├── propertySlice.js   # Property state & filters
│   │   │   └── uiSlice.js         # Mobile drawer & UI modal state
│   │   └── store.js               # Redux Toolkit store
│   ├── styles/
│   │   └── tokens.css             # Obsidian, Gold, typography, radius tokens
│   ├── App.jsx                    # Route hierarchy with ProtectedRoute & AdminRoute
│   ├── index.css                  # Base styles, typography, reset
│   └── main.jsx                   # React root with Redux Provider & Router
├── package.json                   # Root package & workspace scripts
└── vite.config.js                 # Vite bundler configuration with dev reverse proxy
```

---

## 🔐 Experiment 6 — JWT Authentication & Role-Based Access Control

### 1. Two-Role Access Model (`user` vs `admin`)

| Role | Permissions & Boundaries | Protected Endpoints & Views |
| :--- | :--- | :--- |
| **`user`** (Standard Member) | Public catalog browsing, submitting buyer requirements (`POST /api/leads`), submitting property parcels (`POST /api/properties`), accessing personal dashboard (`/dashboard`), managing wishlist. **Cannot** access administrative APIs or views. | `/dashboard`, `GET /api/auth/me`, `POST /api/auth/logout` |
| **`admin`** (Administrator) | All standard user capabilities plus administrative operational dashboard, viewing all buyer leads (`GET /api/leads`), reviewing pending property listings (`GET /api/properties/admin/all`), approving or rejecting property listings (`PATCH /api/properties/:id`). | `/admin`, `GET /api/admin/dashboard`, `GET /api/leads`, `GET /api/properties/admin/all`, `PATCH /api/properties/:id` |

### 2. Authentication API Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Validates payload, hashes password with Bcrypt (salt 10), sets default role to `user`, returns JWT and sets HttpOnly cookie `ph_token`. Prevents role escalation to `admin`. |
| `POST` | `/api/auth/login` | Public | Validates email & password, verifies Bcrypt hash, issues signed JWT (24h expiry), sets HttpOnly cookie `ph_token`, returns user profile. |
| `GET` | `/api/auth/me` | Authenticated | Validates JWT (from `Authorization: Bearer <token>` or cookie), returns currently authenticated user details. |
| `POST` | `/api/auth/logout` | Authenticated / Public | Clears the `ph_token` session cookie and returns a success confirmation. |
| `GET` | `/api/admin/dashboard` | Admin Only | Validates JWT and verifies `admin` role (RBAC). Returns operational system metrics (total users, properties, pending approvals, leads). Standard users receive HTTP `403 Forbidden`. |

### 3. Privilege Escalation Prevention

To prevent malicious users from granting themselves administrative powers:
1. **Server-Side Zod Validation**: The registration schema explicitly restricts allowed public registration roles to `user` (and legacy standard aliases). Any registration payload containing `role: "admin"` or `role: "Admin"` is immediately rejected with HTTP `400 Bad Request`.
2. **Controller Safeguard**: In `authController.js`, even if an unvalidated payload reached the database layer, the code enforces `const safeRole = role && !role.toLowerCase().includes('admin') ? role : 'user'`.
3. **Database Schema Whitelist**: The Mongoose schema strictly enforces role enumeration.

### 4. Secure Administrator Bootstrapping

Because public registration can never create an administrator, the first administrator is provisioned via a dedicated, secure bootstrap utility:

```bash
# Execute administrator bootstrap using environment variables
npm run server:bootstrap-admin
```

This executes `server/src/scripts/bootstrapAdmin.js`, which:
- Reads `ADMIN_EMAIL` (default: `admin@plottagehub.com`), `ADMIN_PASSWORD` (default: `Admin@12345`), and `ADMIN_NAME` from environment variables.
- Connects securely to MongoDB.
- Checks if the administrator account exists; if not, creates the initial record with `role: "Admin"`, triggering password hashing via Bcrypt.
- Can be invoked during system provisioning, CI/CD, or container startup without exposing credentials in client-facing code.

### 5. Frontend Route Guards & Session Restoration

- **`ProtectedRoute`** (`src/components/auth/ProtectedRoute.jsx`): Wraps `/dashboard`. Redirects unauthenticated visitors to `/login` preserving intended destination in navigation state.
- **`AdminRoute`** (`src/components/auth/AdminRoute.jsx`): Wraps `/admin`. If unauthenticated, redirects to `/login`. If authenticated as a standard `user`, renders a luxury dark **HTTP 403 Forbidden Access Restricted** screen with direct navigation back to `/dashboard` or `/`.
- **Session Restoration**: When the user reloads or returns to the application, `App.jsx` dispatches `fetchCurrentUser()`. The backend verifies the token and retrieves the latest user profile. If the token is invalid or expired, the session is cleanly invalidated without unexpected crashes.

---

## 🐳 Experiment 7 — Dockerization & Docker Compose

### 1. Multi-Stage Frontend Dockerfile (`Dockerfile`)

```dockerfile
# Stage 1: Build production bundle
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY public ./public
COPY src ./src
COPY index.html vite.config.js ./
ENV VITE_API_BASE_URL=/api
RUN npm run build

# Stage 2: Serve via Nginx Alpine
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Nginx Reverse-Proxy & SPA Routing Fallback (`nginx.conf`)

Inside Docker Compose, the browser runs on the host machine and cannot resolve Docker internal hostnames like `http://backend:5000`. Therefore, Nginx acts as a same-origin reverse-proxy:

1. **SPA Routing Fallback**: `location / { try_files $uri $uri/ /index.html; }` prevents HTTP 404 errors when refreshing nested React routes like `/explore` or `/admin`.
2. **Reverse Proxy**: `location /api/ { proxy_pass http://backend:5000/api/; ... }` transparently forwards all `/api/*` browser requests to the backend container inside the Docker bridge network.
3. **Security Headers & Compression**: Enables Gzip compression and injects `X-Content-Type-Options: nosniff` and `X-Frame-Options: SAMEORIGIN`.

### 3. Backend Production Dockerfile (`server/Dockerfile`)

- Based on `node:20-alpine` LTS.
- Installs production dependencies via `npm ci --omit=dev`.
- Sets `NODE_ENV=production` and `PORT=5000`.
- Runs as the non-root `node` user (`USER node`) for container security hardening.
- Includes a container healthcheck: `wget --spider http://127.0.0.1:5000/api/health || exit 1`.

### 4. Docker Compose Orchestration (`compose.yaml`)

```yaml
name: plottage-hub

services:
  # 1. MongoDB Database Container
  mongodb:
    image: mongo:7.0
    container_name: plottage-hub-mongodb
    restart: unless-stopped
    ports:
      - "27018:27017"
    volumes:
      - mongodb_data:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--quiet", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    networks:
      - plottage-network

  # 2. Node.js / Express Backend REST API + Socket.IO
  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: plottage-hub-backend
    restart: unless-stopped
    ports:
      - "5000:5000"
    env_file:
      - path: ./server/.env
        required: true
    environment:
      NODE_ENV: production
      PORT: "5000"
      MONGODB_URI: ${DOCKER_MONGODB_URI:-mongodb://mongodb:27017/plottage_hub}
      CLIENT_ORIGIN: "http://localhost,http://localhost:80,http://127.0.0.1,http://127.0.0.1:80"
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - plottage-network
    healthcheck:
      test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://127.0.0.1:5000/api/health || exit 1"]
      interval: 15s
      timeout: 5s
      start_period: 20s
      retries: 3

  # 3. React / Vite SPA Frontend (Nginx — static files + API reverse-proxy)
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: plottage-hub-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - plottage-network
    healthcheck:
      test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://127.0.0.1:80/ || exit 1"]
      interval: 20s
      timeout: 5s
      start_period: 10s
      retries: 3

volumes:
  mongodb_data:
    name: plottage-hub_mongodb_data

networks:
  plottage-network:
    driver: bridge
```

---

## 🚀 Running the Application

### Option A: Local Development Server

1. **Verify MongoDB is running locally**:
   ```powershell
   Get-Service -Name *mongo*
   ```

2. **Seed Initial Database Records**:
   ```bash
   npm run server:seed
   ```

3. **Bootstrap Initial Administrator**:
   ```bash
   npm run server:bootstrap-admin
   ```

4. **Start Backend API Server (Port 5000)**:
   ```bash
   npm run server
   ```

5. **Start Frontend Vite Server (Port 5173)**:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### Option B: Docker Compose Deployment

1. **Ensure Docker Desktop is running** on your system.
2. **Validate the Compose Configuration**:
   ```bash
   docker compose config
   ```
3. **Build Images and Start Stack**:
   ```bash
   docker compose up --build -d
   ```
4. **Check Container Status**:
   ```bash
   docker compose ps
   ```
5. **View Service Logs**:
   ```bash
   docker compose logs -f
   ```
6. **Access Application**:
   - **Frontend**: [http://localhost](http://localhost) or [http://localhost:5173](http://localhost:5173)
   - **Backend Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
7. **Graceful Shutdown**:
   ```bash
   docker compose down
   ```
   *(Note: Named volume `mongodb_data` is preserved, ensuring zero database loss upon restart).*

---

## 🧪 Automated Test Verification Suites

The repository contains 29 comprehensive automated tests across Experiments 4, 5, and 6:

### Run Experiment 6 Verification Suite (12 Tests)
```bash
npm run server:test:exp6
```
```text
✔ 1. Successful registration: creates new user with role "user" and returns safe user object + JWT
✔ 2. Duplicate email rejection: registering with an existing email returns 409 Conflict
✔ 3. Invalid registration data rejection: malformed email or short password returns 400 Bad Request
✔ 4. Successful login: returns valid signed JWT, safe user profile, and HttpOnly session cookie
✔ 5. Incorrect password rejection: invalid password returns 401 Unauthorized
✔ 6. JWT-protected endpoint without a token returns 401 Unauthorized
✔ 7. Invalid or forged token is rejected with 401 Unauthorized
✔ 8. Normal user cannot access administrator-only endpoint GET /api/admin/dashboard (RBAC 403 Forbidden)
✔ 9. Administrator can access authorized admin endpoint GET /api/admin/dashboard (RBAC 200 OK)
✔ 10. User cannot change their role to "Admin" via public registration request (Privilege escalation guard)
✔ 11. Password hashes are never returned in registration, login, or profile payloads
✔ 12. POST /api/auth/logout clears the session cookie and returns success confirmation

ℹ tests 12 | pass 12 | fail 0
```

### Run Experiments 4 & 5 Verification Suite (17 Tests)
```bash
npm run server:test
```
```text
✔ Experiment 4 — REST API, MongoDB and Mongoose Endpoints (7 tests pass)
✔ Experiment 5 — Secure REST APIs & Protection Controls (10 tests pass)

ℹ tests 17 | pass 17 | fail 0
```

### CLI Verification Without Postman (Native PowerShell / cURL)

You can verify the authentication endpoints and RBAC security directly from the terminal without installing Postman:

1. **Verify 401 Unauthorized (Protected Route Guard)**:
   ```bash
   curl.exe -i http://localhost:5000/api/auth/me
   ```
   *Returns `HTTP/1.1 401 Unauthorized` with `{"success":false,"message":"Authentication required. No bearer token provided."}`.*

2. **Verify 200 OK Login & Token Generation**:
   ```powershell
   $body = @{ email = 'buyer@plottagehub.com'; password = 'Buyer@12345' } | ConvertTo-Json
   $res = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' -Method POST -ContentType 'application/json' -Body $body
   $res.user
   ```
   *Returns the authenticated user profile with role `Customer` and issues a valid JWT.*

3. **Verify 403 Forbidden (RBAC Access Boundary)**:
   ```powershell
   $body = @{ email = 'buyer@plottagehub.com'; password = 'Buyer@12345' } | ConvertTo-Json
   $res = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' -Method POST -ContentType 'application/json' -Body $body
   curl.exe -i http://localhost:5000/api/admin/dashboard -H "Authorization: Bearer $($res.token)"
   ```
   *Returns `HTTP/1.1 403 Forbidden` confirming non-admin users cannot access admin-only endpoints.*

---

## 📋 Evaluator Step-by-Step Demonstration

### Experiment 6 Practical Demonstration:
1. **Public Registration**:
   - Navigate to [http://localhost:5173/register](http://localhost:5173/register).
   - Enter name, email, 10-digit mobile number, and password (≥8 characters).
   - Click **Create Account**. Note the successful registration and automatic navigation to the user dashboard.
2. **Normal User Access Boundary**:
   - From `/dashboard`, manually navigate to [http://localhost:5173/admin](http://localhost:5173/admin) in the address bar.
   - Observe the **HTTP 403 Forbidden — Access Restricted** screen: standard users cannot view the administrator portal.
   - Click **User Dashboard** to return to safety.
3. **Sign Out**:
   - Click **Sign Out** in the user menu. Verify the token and session cookies are cleared, and the browser redirects to `/login`.
4. **Administrator Login & Access**:
   - Sign in with pre-seeded administrator credentials:
     - **Email**: `admin@plottagehub.com`
     - **Password**: `Admin@12345`
   - Observe automatic authorization: user menu reveals the gold **Admin Portal** link.
   - Navigate to [http://localhost:5173/admin](http://localhost:5173/admin).
   - Verify that the Admin Dashboard loads live metrics: Active Enquiries, Partner Applications, Active Listings, and Recent Inquiries.

### Experiment 7 Practical Demonstration:
1. Run `docker compose config` to demonstrate valid service syntax, environment variable resolution, and network mapping.
2. Run `docker compose up --build -d` to compile the multi-stage frontend Nginx image and backend Express image.
3. Run `docker compose ps` to demonstrate all 3 containers (`plottage-hub-frontend`, `plottage-hub-backend`, `plottage-hub-mongodb`) running with healthy status.
4. Open [http://localhost](http://localhost) in the browser to demonstrate the containerized SPA.
5. Refresh a nested route like [http://localhost/explore](http://localhost/explore) to prove the Nginx `try_files` SPA fallback prevents 404s.
6. Open [http://localhost:5000/api/health](http://localhost:5000/api/health) to demonstrate backend health and active database connectivity.

---

## 🎓 Viva-Ready Explanations for Examination

### 1. What is a JSON Web Token (JWT) and how does it work?
A JWT is an open, industry-standard (RFC 7519) compact and self-contained token used to securely transmit information between parties as a JSON object. It consists of three parts separated by dots (`.`):
- **Header**: Specifies the token type (`JWT`) and the signing algorithm (e.g. `HS256`).
- **Payload**: Contains the claims (identity data such as user ID, role, and expiration time `exp`).
- **Signature**: Generated by hashing the encoded header and payload with a secret key known only to the server (`HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)`).

When a client makes a request, the server recalculates the signature using its secret key. If the signature matches, the server trusts the claims in the payload without needing a stateful session lookup in memory or Redis.

### 2. What is the difference between Authentication and Authorization?
- **Authentication (AuthN)**: The process of verifying *who* a user is (e.g., verifying an email and matching a Bcrypt password hash). It answers: *"Is this person who they claim to be?"*
- **Authorization (AuthZ)**: The process of verifying *what permissions* an authenticated user has (e.g., checking if `req.user.role === 'admin'`). It answers: *"Does this authenticated user have permission to perform this specific action?"*

### 3. What is the difference between a Docker Image and a Docker Container?
- **Docker Image**: An immutable, read-only template or blueprint containing the operating system filesystem, dependencies, source code, and configuration needed to run an application. Images are organized in stacked layers and created via `docker build`.
- **Docker Container**: A runnable, isolated instance of an image. When an image is run (`docker run`), Docker adds a thin, writable container layer on top of the image layers, creating an isolated process with its own network interface, filesystem, and PID namespace.

### 4. What is Docker Compose and what problem does it solve?
Docker Compose is a declarative tool for defining and orchestrating multi-container Docker applications. Instead of manually running multiple `docker run` commands with complex network, volume, and environment arguments, a single file (`compose.yaml`) describes the entire application stack: services, networks, persistent volumes, startup dependencies (`depends_on`), and health checks. A single command (`docker compose up`) builds and boots the entire interconnected distributed system.

### 5. Why is a Same-Origin Reverse Proxy needed for the Frontend in Docker Compose?
Inside a Docker Compose network, services communicate using internal container names (e.g., `http://backend:5000`). However, a user's web browser runs on the **host machine**, outside the Docker virtual network. If browser JavaScript attempted to fetch `http://backend:5000/api`, DNS resolution would fail on the user's host machine.  
By configuring Nginx on the frontend container as a reverse proxy, the browser makes requests to `http://localhost/api` (same origin). Nginx receives the request inside the Docker network, proxies it to `http://backend:5000/api`, and returns the response to the browser. This eliminates CORS complications and guarantees clean, consistent networking.
