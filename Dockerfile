# C VIDYA SOLUTIONS — Production Google Cloud Run Dockerfile
FROM node:22-slim

WORKDIR /app

# Copy package manifests first for layer caching
COPY package*.json ./

# Install dependencies (including build tools required for Vite + esbuild)
RUN npm ci

# Copy project source files
COPY . .

# Build frontend SPA, prerendered SEO routes, and compiled server bundle (dist/server.cjs)
RUN npm run build

# Prune devDependencies after build to minimize production container surface
RUN npm prune --omit=dev

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "dist/server.cjs"]
