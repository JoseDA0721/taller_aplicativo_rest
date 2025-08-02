# --- Etapa 1: Builder ---
# En esta etapa instalamos todo y construimos la aplicación
FROM node:22-alpine AS builder

WORKDIR /app

# Copiamos los archivos de dependencias e instalamos todo (incl. devDependencies para el build)
COPY package*.json ./
RUN npm install

# Copiamos el resto del código del frontend
COPY . .

# Construimos la aplicación para producción
RUN npm run build

# --- Etapa 2: Runner ---
# Esta es la etapa final, que será mucho más ligera
FROM node:22-alpine

WORKDIR /app

# Copiamos solo los artefactos necesarios desde la etapa 'builder'
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Exponemos el puerto en el que Next.js corre en producción
EXPOSE 3000

# El comando para iniciar la aplicación en modo producción
CMD ["npm", "start"]
