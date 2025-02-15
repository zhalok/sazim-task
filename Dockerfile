FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock (if available)
COPY package.json ./

# Install dependencies
RUN yarn install

# Copy the entire project
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the NestJS app
RUN yarn build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma

# Expose application port
EXPOSE 3000

# Run the application
CMD ["sh", "-c", "npx prisma db push && node prisma/seed/script.js && node dist/main.js"]
