# Using the base image
FROM node:18

# Installing pnpm globally
RUN npm install -g pnpm

# Setting up the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["pnpm", "dev"]
