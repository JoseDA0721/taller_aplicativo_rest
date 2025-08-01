# Sistema de Gestión de Órdenes para Taller Automotriz

Este es un proyecto Full-Stack que simula un sistema para la gestión de órdenes de trabajo en un taller automotriz. La aplicación permite crear y visualizar órdenes de trabajo, asociando clientes, vehículos, servicios y productos, con una interfaz moderna e interactiva.

## Tecnologías Utilizadas

* **Backend**: Node.js, Express, SQLite3
* **Frontend**: Next.js, React, TypeScript, Tailwind CSS

## 🚀 Puesta en Marcha del Proyecto

Para ejecutar este proyecto en tu entorno local, sigue los pasos a continuación.

### Prerrequisitos

* Tener instalado [Node.js](https://nodejs.org/) (se recomienda la versión LTS o superior).

### 1. Configuración del Backend

El backend se encarga de la lógica de negocio y la comunicación con la base de datos.

**Paso 1: Navegar a la carpeta del backend**
En tu terminal, navega a la carpeta `backend`.
```bash
cd backend
```

**Paso 2: Instalar dependencias**
Ejecuta el siguiente comando para instalar todas las librerías necesarias (Express, SQLite3, CORS, etc.).
```bash
npm install
```

**Paso 3: Crear y poblar la base de datos**
El proyecto utiliza un script para crear automáticamente el archivo de la base de datos (`taller.sqlite`) y llenarlo con datos de prueba (clientes, productos, servicios, etc.).
```bash
node scripts/create-db.js
```
*Este comando solo necesita ejecutarse una vez. Si en el futuro quieres restaurar la base de datos a su estado inicial, simplemente borra el archivo `taller.sqlite` y vuelve a ejecutar el script.*

**Paso 4: Iniciar el servidor**
Este comando iniciará el servidor de la API, que por defecto se ejecutará en `http://localhost:5000`.
```bash
npm start
```
¡El backend ya está listo y escuchando peticiones! Deja esta terminal abierta.

### 2. Configuración del Frontend

El frontend es una aplicación moderna construida con Next.js que consume la API del backend.

**Paso 1: Navegar a la carpeta del frontend**
Abre una **nueva terminal** (sin cerrar la del backend) y navega a la carpeta correspondiente.
```bash
cd taller-frontend
```

**Paso 2: Instalar dependencias**
Ejecuta el siguiente comando para instalar React, Next.js y otras librerías del cliente.
```bash
npm install
```

**Paso 3: Iniciar la aplicación cliente**
Este comando iniciará el servidor de desarrollo de Next.js, que por defecto se ejecutará en `http://localhost:3000`.
```bash
npm run dev
```

### 3. Acceder a la Aplicación

Una vez que tanto el backend como el frontend estén en ejecución, abre tu navegador y ve a la siguiente dirección:

[**http://localhost:3000/ordenes**](http://localhost:3000/ordenes)

Desde allí, podrás interactuar con la aplicación, crear nuevas órdenes de trabajo, ver los detalles de las existentes y cambiar su estado.

## Estructura del Proyecto

El repositorio está organizado en dos carpetas principales para una clara separación de responsabilidades:

* `backend/`: Contiene todo el código del servidor Node.js/Express.
    * `config/`: Configuración de la conexión a la base de datos.
    * `controllers/`: Lógica de negocio para cada ruta (qué hacer cuando se recibe una petición).
    * `routes/`: Definición de los endpoints de la API (las URLs que el frontend puede llamar).
    * `scripts/`: Scripts para tareas de mantenimiento, como la creación de la BD.
    * `taller.sqlite`: El archivo de la base de datos (se genera automáticamente).
* `taller-frontend/`: Contiene todo el código de la aplicación Next.js.
    * `src/app/`: Rutas y páginas principales de la aplicación. La página principal es `ordenes/`.
    * `src/components/`: Componentes reutilizables de React (modales, tablas, etc.).
    * `src/services/`: Funciones para comunicarse con la API del backend.
