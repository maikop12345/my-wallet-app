# Etapa 1: Construcción de dependencias
FROM node:18-alpine AS builder

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build || echo "No hay build step; instaladas dependencias"

# Etapa 2: Imagen de producción
FROM node:18-alpine

WORKDIR /usr/src/app
ENV NODE_ENV=production

# Solo copiamos node_modules y el código necesario
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app ./

# Exponer el puerto que usa Express
EXPOSE 3000

# Comando para iniciar la app
CMD ["node", "server.js"]
