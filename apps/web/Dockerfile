FROM oven/bun:1.3.11 AS deps

WORKDIR /repo

COPY package.json bun.lock turbo.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/api/package.json apps/api/package.json

RUN bun install --frozen-lockfile

FROM deps AS builder

COPY apps/web ./apps/web

WORKDIR /repo/apps/web

ARG NEXT_PUBLIC_API_HOST=http://localhost:8000
ARG NEXT_PUBLIC_WS_URL=ws://localhost:8000
ARG API_BASE_URL=http://api:8000

ENV NEXT_PUBLIC_API_HOST=$NEXT_PUBLIC_API_HOST
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL
ENV API_BASE_URL=$API_BASE_URL

RUN bun run build

FROM oven/bun:1.3.11-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /repo/apps/web/.next/standalone ./
COPY --from=builder /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /repo/apps/web/public ./apps/web/public

EXPOSE 3000

CMD ["bun", "apps/web/server.js"]
