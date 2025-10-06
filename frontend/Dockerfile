# Etapa 1: Builder
FROM node:18-alpine AS builder

# Instala pnpm globalmente
RUN npm install -g pnpm

WORKDIR /app

# Copia apenas os arquivos necessários para instalar dependências
COPY pnpm-lock.yaml ./
COPY package.json ./

# Instala dependências com pnpm (sem node_modules locais)
RUN pnpm install --frozen-lockfile

# Copia o restante do código
COPY . .

# Gera o build de produção
RUN pnpm build

# Etapa 2: Runner
FROM node:18-alpine AS runner
RUN npm install -g pnpm

WORKDIR /app

# Copia apenas o que é necessário do builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

# Instala somente as dependências de produção
RUN pnpm install --prod --frozen-lockfile

ENV PORT=3000
ENV NEXT_PUBLIC_API_URL=http://localhost:3001

EXPOSE 3000

CMD ["pnpm", "start"]
