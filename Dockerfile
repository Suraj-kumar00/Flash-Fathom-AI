# Stage 1: Build application
FROM node:18-alpine AS builder

WORKDIR /app

# Install system dependencies for Prisma
RUN apk add --no-cache openssl

# Copy package management files
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma  

# Install dependencies
RUN npm install -g pnpm

# Generate Prisma client
RUN npx prisma generate

# Copy remaining source files
COPY . .

# Inject environment variables during build
ARG GEMINI_API_KEY
ARG DATABASE_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV GEMINI_API_KEY=${GEMINI_API_KEY}
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}

# Build application
RUN pnpm run build

# Stage 2: Production image
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install pnpm in the production image
RUN npm install -g pnpm

# Copy built assets and production dependencies
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Ensure pnpm is available at runtime
CMD ["pnpm", "start"]
