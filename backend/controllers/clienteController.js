const db = require('../config/db'); // Importamos la conexión única

// Obtener todos los clientes
exports.getAllClientes = (req, res) => {
    const sql = "SELECT * FROM clientes";
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
};

// Obtener un cliente por cédula
exports.getClienteByCedula = (req, res) => {
    const { cedula } = req.params;
    const sql = "SELECT * FROM clientes WHERE cedula = ?";
    db.get(sql, [cedula], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.status(200).json(row);
    });
};

// Crear un nuevo cliente
exports.createCliente = (req, res) => {
    const { cedula, nombre, telefono, correo, ciudad_id } = req.body;
    if (!cedula || !nombre || !ciudad_id) {
        return res.status(400).json({ message: 'Cédula, nombre y ciudad son requeridos.' });
    }

    const sql = `INSERT INTO clientes (cedula, nombre, telefono, correo, ciudad_id) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [cedula, nombre, telefono, correo, ciudad_id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: `Cliente creado con cédula ${cedula}` });
    });
};

// Actualizar un cliente
exports.updateCliente = (req, res) => {
    const { cedula } = req.params;
    const { nombre, telefono, correo } = req.body;

    const sql = `UPDATE clientes SET nombre = ?, telefono = ?, correo = ? WHERE cedula = ?`;
    db.run(sql, [nombre, telefono, correo, cedula], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.status(200).json({ message: `Cliente ${cedula} actualizado.` });
    });
};

// Eliminar un cliente
exports.deleteCliente = (req, res) => {
    const { cedula } = req.params;
    const sql = 'DELETE FROM clientes WHERE cedula = ?';
    db.run(sql, [cedula], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.status(200).json({ message: `Cliente ${cedula} eliminado.` });
    });
};