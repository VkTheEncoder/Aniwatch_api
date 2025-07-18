# build stage for building .ts files
FROM node:22-alpine as build

RUN apk add --no-cache git openssh ca-certificates

RUN mkdir /home/app

WORKDIR /home/app

COPY package.json .

RUN npm install --ignore-scripts

COPY . .

RUN npm run build

# prod stage for including only necessary files
FROM node:22-alpine as prod

LABEL org.opencontainers.image.source=https://github.com/ghoshRitesh12/aniwatch-api
LABEL org.opencontainers.image.description="NodeJS API for obtaining anime data from hianime.to"
LABEL org.opencontainers.image.licenses=MIT

# install curl for healthcheck
RUN apk add --no-cache curl

RUN apk add --no-cache curl git openssh ca-certificates

# create a non-privileged user
RUN addgroup -S aniwatch && adduser -S zoro -G aniwatch

# set secure folder permissions
RUN mkdir -p /app/public /app/dist && chown -R zoro:aniwatch /app

# set non-privileged user
USER zoro

# set working directory
WORKDIR /app

# copy config file for better use of layers
COPY --chown=zoro:aniwatch package.json .

# install dependencies
RUN npm install --omit=dev --ignore-scripts

# copy public folder from build stage to prod
COPY --from=build --chown=zoro:aniwatch /home/app/public /app/public

# copy dist folder from build stage to prod
COPY --from=build --chown=zoro:aniwatch /home/app/dist /app/dist

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s CMD [ "npm", "run", "healthcheck" ]

ENV NODE_ENV=production
ENV PORT=4000

# exposed port
EXPOSE 4000

CMD [ "node", "dist/src/server.js" ]

# exit
