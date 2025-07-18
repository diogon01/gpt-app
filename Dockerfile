# Base image
FROM node:20-alpine

# Bash e dependências úteis
RUN apk add --no-cache bash

# Diretório da aplicação
WORKDIR /app

# Copia tudo
COPY . .

# Ativa pnpm via corepack
RUN corepack enable && corepack prepare pnpm@10.12.4 --activate

# Instala dependências e compila tudo
RUN pnpm install
RUN pnpm build

# Expõe as portas da API e do Frontend (Vite)
EXPOSE 3000 80

# Comando padrão: roda API e Frontend juntos
CMD ["pnpm", "start"]
