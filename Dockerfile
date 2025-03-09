# Use a minimal base image
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm \
    && pnpm install --frozen-lockfile --prod 

COPY . .

RUN pnpm build

# Use a clean, minimal final image
FROM node:18-alpine AS production

WORKDIR /app

# Copy only necessary files
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/.next /app/.next
COPY package.json ./

EXPOSE 3000

CMD ["pnpm", "dev"]
