# Stage 1: Build React client
FROM node:20-alpine AS builder

WORKDIR /build/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Production server
FROM node:20-alpine AS runner

WORKDIR /app
COPY server/package*.json ./
RUN npm install --omit=dev
COPY server/ ./

# Copy built client into server's public directory
COPY --from=builder /build/client/dist ./public

EXPOSE 3001
CMD ["node", "index.js"]
