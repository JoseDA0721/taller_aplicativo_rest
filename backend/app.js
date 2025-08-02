const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar las rutas
const clienteRoutes = require('./routes/clienteRoutes');
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const ordenRoutes = require('./routes/ordenRoutes');
const catalogoRoutes = require('./routes/catalogoRoutes');


// Inicializar la aplicación de Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Mensaje de bienvenida en la ruta raíz
app.get('/', (req, res) => {
    res.send('API del Sistema de Taller Mecánico funcionando correctamente.');
});

// Rutas de la API
app.use('/api', clienteRoutes);
app.use('/api', vehiculoRoutes);
app.use('/api', ordenRoutes);
app.use('/api', catalogoRoutes);

// Exportamos la app para que pueda ser usada por las pruebas y por server.js
module.exports = app;