FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY server/package.json server/package-lock.json* ./
RUN npm ci --omit=dev

# Build
FROM base AS builder
COPY server/ ./
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production
FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY server/ ./
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules

USER nodejs
EXPOSE 5000
CMD ["node", "dist/server.js"]
