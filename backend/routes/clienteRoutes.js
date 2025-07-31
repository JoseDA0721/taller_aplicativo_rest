const express = require('express');
const router = express.Router();

// Importar las funciones del controlador de clientes
const {
    getAllClientes,
    getClienteByCedula,
    createCliente,
    updateCliente,
    deleteCliente
} = require('../controllers/clienteController');

// Definir las rutas del CRUD
router.get('/clientes', getAllClientes);

router.get('/cliente/:cedula', getClienteByCedula);

router.post('/cliente', createCliente);

router.put('/cliente/:cedula', updateCliente);

router.delete('/cliente/:cedula', deleteCliente);

module.exports = router;
