# Backend Dockerfile for docker-compose setup
FROM node:22-slim

# Labels for image metadata
LABEL author="Jahn-Aage Hegg"
LABEL version="0.0.3"

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose the port the app runs on (matching docker-compose config)
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "start"]