# ─── BUILD STAGE ───────────────────────────────────────────────────────
FROM node:22-alpine AS build

# 1) install git so npm can clone your forked 'aniwatch'
RUN apk add --no-cache git

WORKDIR /home/app

# 2) copy package files and install ALL deps (dev+prod)
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# 3) copy rest of code and build
COPY . .
RUN npm run build

# ─── PROD STAGE ────────────────────────────────────────────────────────
FROM node:22-alpine AS prod

# 4) install curl (for healthchecks, if you still need them)
RUN apk add --no-cache curl

# 5) create a non-privileged user
RUN addgroup -S aniwatch && adduser -S zoro -G aniwatch

WORKDIR /app

# 6) copy only what's needed at runtime:
#    - your built JS in /dist
#    - any static assets in /public
#    - your exact node_modules from the build
COPY --from=build --chown=zoro:aniwatch /home/app/dist ./dist
COPY --from=build --chown=zoro:aniwatch /home/app/public ./public
COPY --from=build --chown=zoro:aniwatch /home/app/node_modules ./node_modules
COPY --from=build --chown=zoro:aniwatch /home/app/package.json ./package.json

# 7) switch to non-privileged user
USER zoro

# 8) expose and run
EXPOSE 4000
CMD ["node", "dist/src/server.js"]
