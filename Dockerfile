# ──────────────────────────────────────────────
# 1️⃣ Build Stage — instala deps, compila e poda
# ──────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@10.12.4 --activate
COPY . .
RUN pnpm install --no-frozen-lockfile --prefer-offline
RUN pnpm --filter @42robotics/domain... run build && \
  pnpm --filter @42robotics/infra...  run build && \
  pnpm --filter api run build        && \
  pnpm --filter web run build
RUN pnpm prune --prod

# ──────────────────────────────────────────────
# 2️⃣ Runtime Stage — imagem enxuta e funcional
# ──────────────────────────────────────────────
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# ✅ instala o bash para debugging
RUN apk add --no-cache bash

RUN apk --no-cache add nginx
COPY nginx.conf /etc/nginx/nginx.conf

# ✅ copia o workspace inteiro (node_modules, apps, packages etc.)
COPY --from=build /workspace .

EXPOSE 80
CMD ["sh", "-c", "node api/server.js & nginx -g 'daemon off;'"]
