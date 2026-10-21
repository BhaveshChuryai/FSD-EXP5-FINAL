# ==============================================================================
# Plottage Hub Backend API Dockerfile
# Node.js 20 LTS Alpine Runtime
# ==============================================================================
FROM node:20-alpine

WORKDIR /app

# Install production dependencies reproducibly
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy backend source code
COPY src ./src

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Run as non-root user for container security
USER node

# Expose backend port
EXPOSE 5000

# Healthcheck to verify Express API and MongoDB connectivity
HEALTHCHECK --interval=20s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:5000/api/health || exit 1

CMD ["node", "src/server.js"]
