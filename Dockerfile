# Stage 1: Build application
FROM node:18-alpine AS builder

WORKDIR /app

# Install system dependencies for Prisma
RUN apk add --no-cache openssl

# Copy package management files
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma  

# Install dependencies
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

# Generate Prisma client
RUN npx prisma generate

# Copy remaining source files
COPY . .

# Build application
RUN pnpm run build

# Stage 2: Production image
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy built assets and production dependencies
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Install PRODUCTION dependencies only (fixed typo)
RUN pnpm install --frozen-lockfile --prod

EXPOSE 3000

CMD ["pnpm", "start"]