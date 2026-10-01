# Monorepo-root build context (see docker-compose.yaml).
# Run: docker build -f misun-academy-client/Dockerfile --build-arg NEXT_PUBLIC_*=… .
FROM node:22-alpine AS base
RUN corepack enable && apk add --no-cache tini
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY misun-academy-server/package.json ./misun-academy-server/package.json
COPY misun-academy-client/package.json ./misun-academy-client/package.json
COPY Esun-Point-Client/package.json ./Esun-Point-Client/package.json
RUN pnpm install --frozen-lockfile

FROM base AS dev
ENV NODE_ENV=development
COPY . .
EXPOSE 3000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["pnpm", "--filter", "misun-academy", "run", "dev"]

FROM base AS builder
WORKDIR /app
COPY . .
# NEXT_PUBLIC_* are baked at build time — pass via --build-arg.
ARG NEXT_PUBLIC_BASE_API_URL
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_AUTH_URL
ARG NEXT_PUBLIC_MA_FRONTEND_URL
ARG NEXT_PUBLIC_EP_FRONTEND_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_FACEBOOK_PIXEL_ID
ARG NEXT_PUBLIC_GA_ID
ENV NEXT_PUBLIC_BASE_API_URL=$NEXT_PUBLIC_BASE_API_URL \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_AUTH_URL=$NEXT_PUBLIC_AUTH_URL \
    NEXT_PUBLIC_MA_FRONTEND_URL=$NEXT_PUBLIC_MA_FRONTEND_URL \
    NEXT_PUBLIC_EP_FRONTEND_URL=$NEXT_PUBLIC_EP_FRONTEND_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_FACEBOOK_PIXEL_ID=$NEXT_PUBLIC_FACEBOOK_PIXEL_ID \
    NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID
RUN pnpm --filter misun-academy build

FROM node:22-alpine AS production
RUN apk add --no-cache tini wget && addgroup -S app && adduser -S app -G app
WORKDIR /app
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0
COPY --from=builder /app/misun-academy-client/public ./public
COPY --from=builder /app/misun-academy-client/.next/standalone ./
COPY --from=builder /app/misun-academy-client/.next/static ./.next/static
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ || exit 1
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
