# ──────────────────────────────────────────────
# 1️⃣ Builder Stage — compila dependências + front
# ──────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.12.4 --activate

# 1. Manifests
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY apps/*/package.json apps/
COPY packages/*/package.json packages/

# 2. Código completo (node_modules ignorado via .dockerignore)
COPY . .

# 3. Instala todas as dependências
RUN pnpm install --no-frozen-lockfile

# 4. Tipos globais
RUN pnpm add -Dw @types/node

# 5. Compila pacotes e front
RUN pnpm --filter @42robotics/domain... run build && \
  pnpm --filter @42robotics/infra...  run build && \
  pnpm --filter api                   run build && \
  pnpm --filter web                   run build
# 👉 sem `pnpm prune --prod`

# ──────────────────────────────────────────────
# 2️⃣ Runtime da API
# ──────────────────────────────────────────────
FROM node:20-alpine AS api-runner
WORKDIR /app
ENV NODE_ENV=production

# Bash para debug
RUN apk add --no-cache bash

# Copia node_modules completo (contém express, cors, etc.)
COPY --from=builder /app/node_modules ./node_modules

# Copia dist da API e libs locais
COPY --from=builder /app/apps/api/dist              ./apps/api/dist
COPY --from=builder /app/packages/domain/dist       ./node_modules/@42robotics/domain
COPY --from=builder /app/packages/infra/dist        ./node_modules/@42robotics/infra/src
COPY --from=builder /app/packages/infra/package.json ./node_modules/@42robotics/infra/package.json

# Arquivo .env (se precisar)
COPY apps/api/.env ./apps/api/.env

EXPOSE 3000

CMD ["node", "apps/api/dist/apps/api/src/server.js"]
