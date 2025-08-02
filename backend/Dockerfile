# --- Etapa 1: Build ---
# Usamos una imagen ligera de Node.js
FROM node:22-alpine AS base

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos solo las dependencias de producción para mantener la imagen ligera
RUN npm install --production

# Copiamos el resto del código de la aplicación
COPY . .

# --- Etapa 2: Producción ---
# La imagen final será más pequeña porque no incluye dependencias de desarrollo
FROM base

# Exponemos el puerto en el que corre nuestra API
EXPOSE 5000

# El comando que se ejecutará cuando el contenedor inicie
CMD [ "node", "server.js" ]
