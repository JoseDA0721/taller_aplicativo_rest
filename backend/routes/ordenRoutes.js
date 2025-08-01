const express = require('express');
const router = express.Router();
const {
    getAllOrdenes,
    createOrden,
    getOrden,
    getOrdenesByCliente,
    updateOrden,
    detallesOrden
} = require('../controllers/ordenController');

router.get('/ordenes', getAllOrdenes);
router.post('/orden', createOrden);
router.get('/orden/id/:orden_id', getOrden);
router.get('/orden/cliente/:cedula', getOrdenesByCliente);
router.put('/orden/:orden_id', updateOrden);
router.get('/orden/detalles/:orden_id', detallesOrden);


module.exports = router;