# Etapa 1: Build
FROM node:18 AS builder

WORKDIR /app

# Copia apenas arquivos de dependências
COPY pnpm-lock.yaml package.json ./

RUN npm install -g pnpm
RUN pnpm install

# Copia o restante do código
COPY . .

# Gera o build do NestJS 
RUN pnpm build

# Etapa 2: Runtime 
FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copia apenas os arquivos necessários do build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

RUN pnpm install --prod

# Expõe a porta do NestJS
EXPOSE 3001

# Inicia a aplicação
CMD ["node", "dist/main.js"]
