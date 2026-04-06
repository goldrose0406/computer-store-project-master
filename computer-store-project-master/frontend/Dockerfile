# Build stage - React
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps && npm install ajv@^8.0.0

COPY . .

RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve to run the built React app
RUN npm install -g serve

COPY --from=builder /app/build ./build

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["serve", "-s", "build", "-l", "3000"]
