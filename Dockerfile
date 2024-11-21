# Use Node.js for building
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build
RUN npm run export

# Production image using lightweight Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy the built static files from builder stage
COPY --from=builder /app/out .

# Copy custom Nginx configuration if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]