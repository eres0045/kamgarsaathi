# KamgarSaathi — container image.
#
# Node 22 to match the toolchain this app was generated and
# type-checked with; a different major is a different set of type errors.
FROM node:22-bookworm-slim AS deps
WORKDIR /app
# Only the manifests first, so a source-only change does not reinstall.
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
# Never run as root in a container that serves the internet.
USER node
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .
EXPOSE 3000
CMD ["sh", "-c", "npm run dev"]
