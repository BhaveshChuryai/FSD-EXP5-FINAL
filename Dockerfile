# ==============================================================================
# Stage 1: Build Frontend Production Artifacts
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies using the reproducible lockfile
COPY package.json package-lock.json ./
RUN npm ci

# Copy application source code and configurations
COPY public ./public
COPY src ./src
COPY index.html ./
COPY vite.config.js ./

# Set API base URL to relative /api which Nginx proxies to the backend
ENV VITE_API_BASE_URL=/api

# Compile production bundle
RUN npm run build

# ==============================================================================
# Stage 2: Serve via Lightweight Production Nginx
# ==============================================================================
FROM nginx:1.27-alpine

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration supporting SPA routing fallback and API proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]
