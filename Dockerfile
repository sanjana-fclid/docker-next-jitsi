FROM node:20-alpine

WORKDIR /app

# Copy all project files first
COPY . .

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]