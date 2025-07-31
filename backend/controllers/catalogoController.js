const db = require('../config/db'); // Importamos la conexión única

exports.getServicios = (req, res) => {
    db.all("SELECT * FROM servicios ORDER BY nombre", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(rows);
    });
};

exports.getCiudades = (req, res) => {
    db.all("SELECT * FROM ciudades ORDER BY nombre", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(rows);
    });
};

exports.getTiposVehiculo = (req, res) => {
    db.all("SELECT * FROM tipos_vehiculos ORDER BY nombre", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(rows);
    });
};

exports.getProductos = (req, res) => {
    db.all("SELECT * FROM productos ORDER BY nombre", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(rows);
    });
};