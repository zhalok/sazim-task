FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock (if available)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the entire project
COPY . .

# Build the NestJS app
RUN yarn build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Expose application port
EXPOSE 3000

# Run the application
CMD ["node", "dist/main.js"]
