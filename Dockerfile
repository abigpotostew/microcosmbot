# syntax=docker/dockerfile:1

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy turbo.json and package.json files (turbo.json needed for prepare scripts)
COPY package.json yarn.lock turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/bot/package.json ./packages/bot/
COPY packages/db/package.json ./packages/db/
COPY packages/eslint-config-custom/package.json ./packages/eslint-config-custom/
COPY packages/tailwind-config/package.json ./packages/tailwind-config/
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY packages/ui/package.json ./packages/ui/

# Copy Prisma schema before install (needed for prepare script)
COPY packages/db/prisma ./packages/db/prisma

# Install dependencies
RUN yarn install --frozen-lockfile --production=false

# ============================================
# Stage 2: Builder
# ============================================
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages/bot/node_modules ./packages/bot/node_modules
COPY --from=deps /app/packages/db/node_modules ./packages/db/node_modules
COPY --from=deps /app/packages/eslint-config-custom/node_modules ./packages/eslint-config-custom/node_modules
COPY --from=deps /app/packages/tailwind-config/node_modules ./packages/tailwind-config/node_modules
COPY --from=deps /app/packages/ui/node_modules ./packages/ui/node_modules

# Copy source files
COPY . .

# Generate Prisma Client
RUN cd packages/db && npx prisma generate

# Build the application using Turbo
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_GETME_BOT_INFO={"id":6277121004,"is_bot":true,"first_name":"MicroCosmBot","username":"microcosmbotdotxyz_bot","can_join_groups":true,"can_read_all_group_messages":true,"supports_inline_queries":false}

# Build with turbo
RUN yarn build

# ============================================
# Stage 3: Runner
# ============================================
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

# Copy Prisma files - standalone output should include these in node_modules
# If Prisma is used by the app, it will be in the standalone output
# We also copy the schema for potential migrations
COPY --from=builder /app/packages/db/prisma ./packages/db/prisma

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the Next.js application
CMD ["node", "apps/web/server.js"]

