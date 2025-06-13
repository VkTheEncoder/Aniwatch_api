# ─── BUILD STAGE ─────────────────────────────────────────────────────
FROM node:22-alpine AS build

# 1) install git so npm can clone your patched aniwatch fork
RUN apk add --no-cache git

WORKDIR /home/app

# 2) copy package.json and install ALL deps (dev + prod)
COPY package.json ./
RUN npm install --ignore-scripts

# 3) copy rest of the repo and build TypeScript
COPY . .
RUN npm run build

# ─── PROD STAGE ──────────────────────────────────────────────────────
FROM node:22-alpine AS prod

# 4) install curl (for healthcheck) – no git needed here
RUN apk add --no-cache curl

# 5) create and switch to non-privileged user
RUN addgroup -S aniwatch && adduser -S zoro -G aniwatch
USER zoro

WORKDIR /app

# 6) copy built artifacts and exact node_modules from the build image
COPY --from=build --chown=zoro:aniwatch /home/app/dist    ./dist
COPY --from=build --chown=zoro:aniwatch /home/app/public  ./public
COPY --from=build --chown=zoro:aniwatch /home/app/node_modules ./node_modules
COPY --from=build --chown=zoro:aniwatch /home/app/package.json   ./package.json

# 7) expose port and run
EXPOSE 4000
CMD ["node", "dist/src/server.js"]
