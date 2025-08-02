# --- Etapa 1: Build ---
    FROM node:22-alpine AS base

    WORKDIR /app
    
    # Copiamos los archivos de dependencias
    COPY package*.json ./
    
    # Instalamos solo las dependencias de producción
    RUN npm install --production
    
    # Copiamos el resto del código de la aplicación
    COPY . .
    
    # --- Etapa 2: Producción ---
    FROM base
    
    EXPOSE 5000
    
    # --- SOLUCIÓN: Lógica de inicialización integrada ---
    # Este comando se ejecuta cada vez que el contenedor inicia.
    # 1. Comprueba si el archivo de la base de datos NO existe (! -f).
    # 2. Si no existe, ejecuta el script para crearla (&& node ...).
    # 3. Finalmente, inicia el servidor (&& node server.js).
    CMD ["sh", "-c", "if [ ! -f /app/taller.sqlite ]; then node /app/scripts/create-db.js; fi && node server.js"]
    