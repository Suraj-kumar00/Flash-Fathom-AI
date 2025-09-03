# ================================
# Stage 1: Build Stage
# ================================
FROM node:18-alpine AS builder

# Install system dependencies
RUN apk add --no-cache openssl libc6-compat postgresql-client

WORKDIR /app

# Enable corepack and install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma

# Install dependencies
RUN pnpm install

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# ================================
# ONLY PUBLIC BUILD-TIME VARIABLES
# ================================
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_RAZORPAY_KEY_ID

# Set only public environment variables for build
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
ENV NEXT_PUBLIC_RAZORPAY_KEY_ID=${NEXT_PUBLIC_RAZORPAY_KEY_ID}

# Create dummy values for build (will be overridden at runtime)
ENV RAZORPAY_KEY_ID="dummy_for_build"
ENV RAZORPAY_KEY_SECRET="dummy_for_build"
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV CLERK_SECRET_KEY="dummy_for_build"
ENV GEMINI_API_KEY="dummy_for_build"

# Build the application
RUN pnpm run build

# ================================
# Stage 2: Production Runtime
# ================================
FROM node:18-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Enable corepack and install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install runtime dependencies INCLUDING postgresql-client for pg_isready
RUN apk add --no-cache openssl libc6-compat postgresql-client

# Create non-root user
RUN addgroup --system --gid 1001 flashfathom \
    && adduser --system --uid 1001 flashfathom

# Copy built application from builder stage
COPY --from=builder --chown=flashfathom:flashfathom /app/.next ./.next
COPY --from=builder --chown=flashfathom:flashfathom /app/public ./public
COPY --from=builder --chown=flashfathom:flashfathom /app/package.json ./package.json
COPY --from=builder --chown=flashfathom:flashfathom /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder --chown=flashfathom:flashfathom /app/prisma ./prisma
COPY --from=builder --chown=flashfathom:flashfathom /app/node_modules ./node_modules

# Switch to non-root user
USER flashfathom

EXPOSE 3000

ENV PORT=3000
ENV HOST=0.0.0.0

# INLINE COMMAND: No separate startup script needed
CMD ["sh", "-c", "echo 'Starting Flash Fathom AI...' && echo 'Waiting for database...' && while ! pg_isready -h postgres -p 5432 -U postgres; do echo 'Database unavailable - sleeping'; sleep 2; done && echo '✅ Database ready!' && echo 'Running Prisma migrations...' && npx prisma migrate deploy && echo 'Generating Prisma client...' && npx prisma generate && echo 'Starting application...' && pnpm start"]
