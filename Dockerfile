# ── Stage 1: Build frontend ───────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY client/package*.json ./client/
RUN cd client && npm ci

COPY client/ ./client/

ARG VITE_API_URL
ARG VITE_SOCKET_URL
ARG VITE_RECAPTCHA_SITE_KEY

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL
ENV VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY

RUN cd client && npm run build

# ── Stage 2: Production server ────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

COPY server/ ./server/
COPY --from=builder /app/client/dist ./client/dist

WORKDIR /app/server

EXPOSE 5001

CMD ["node", "src/server.js"]
