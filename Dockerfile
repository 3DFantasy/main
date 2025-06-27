FROM node:20.10.0 as build

WORKDIR /app

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20.10.0

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit-dev

COPY --from=build /app/.env ./

# Prisma generate
COPY prisma .
RUN npx prisma generate

# playwright install
RUN playwright install --with-deps

# Copy build artifacts from build stage
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]