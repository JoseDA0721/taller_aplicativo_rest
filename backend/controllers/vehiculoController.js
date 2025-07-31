const db = require('../config/db'); // Importamos la conexión única a SQLite

// Obtener todos los vehículos
exports.getAllVehiculos = (req, res) => {
    const sql = "SELECT * FROM vehiculos";
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
};

// Obtener un vehículo por su placa
exports.getVehiculoByPlaca = (req, res) => {
    const { placa } = req.params;
    const sql = "SELECT * FROM vehiculos WHERE placa = ?";
    db.get(sql, [placa], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }
        res.status(200).json([row]); // Se devuelve como array para mantener consistencia con el frontend
    });
};

// --- FUNCIÓN CORREGIDA Y AÑADIDA ---
// Obtener vehículos por cédula del cliente
exports.getVehiculoByCliente = (req, res) => {
    const { cliente_cedula } = req.params;
    const sql = "SELECT * FROM vehiculos WHERE cliente_cedula = ?";
    db.all(sql, [cliente_cedula], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron vehículos para ese cliente' });
        }
        res.status(200).json(rows);
    });
};
// --- FIN DE LA CORRECCIÓN ---

// Crear un nuevo vehículo
exports.createVehiculo = (req, res) => {
    const { placa, marca, modelo, tipo_id, cliente_cedula } = req.body;
    if (!placa || !marca || !modelo || !tipo_id || !cliente_cedula) {
        return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }

    const sql = `INSERT INTO vehiculos (placa, marca, modelo, tipo_id, cliente_cedula) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [placa, marca, modelo, tipo_id, cliente_cedula], function(err) {
        if (err) {
            if (err.message.includes('FOREIGN KEY constraint failed')) {
                return res.status(400).json({ message: `El cliente con cédula ${cliente_cedula} no existe.` });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Vehículo creado exitosamente.' });
    });
};

// Actualizar un vehículo
exports.updateVehiculo = (req, res) => {
    const { placa } = req.params;
    const { marca, modelo, tipo_id } = req.body;

    const sql = `UPDATE vehiculos SET marca = ?, modelo = ?, tipo_id = ? WHERE placa = ?`;
    db.run(sql, [marca, modelo, tipo_id, placa], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }
        res.status(200).json({ message: `Vehículo ${placa} actualizado.` });
    });
};

// Eliminar un vehículo
exports.deleteVehiculo = (req, res) => {
    const { placa } = req.params;
    const sql = 'DELETE FROM vehiculos WHERE placa = ?';
    db.run(sql, [placa], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }
        res.status(200).json({ message: `Vehículo con placa ${placa} eliminado exitosamente.` });
    });
};