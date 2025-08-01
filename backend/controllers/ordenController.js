const db = require('../config/db'); // Importamos la conexión única

// Obtener todas las órdenes
exports.getAllOrdenes = (req, res) => {
    const sql = "SELECT * FROM ordenes_trabajo";
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
};

// Obtener una orden por su ID
exports.getOrden = (req, res) => {
    const { orden_id } = req.params;
    const sql = "SELECT * FROM ordenes_trabajo WHERE orden_id = ?";
    db.get(sql, [orden_id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        res.status(200).json([row]);
    });
};

// Obtener órdenes por cédula de cliente
exports.getOrdenesByCliente = (req, res) => {
    const { cedula } = req.params;
    const sql = "SELECT * FROM ordenes_trabajo WHERE cliente_cedula = ?";
    db.all(sql, [cedula], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
};
// Crear una nueva orden de trabajo
exports.createOrden = (req, res) => {
    const { cliente_cedula, placa, fecha, estado, ciudad_id } = req.body;

    if (!cliente_cedula || !placa || !ciudad_id) {
        return res.status(400).json({ message: 'Faltan datos críticos (cliente, placa o ciudad).' });
    }

    // 1. Definir el prefijo y la consulta para el último ID
    const prefijo = 'OT';
    const lastIdSql = `SELECT orden_id FROM ordenes_trabajo WHERE orden_id LIKE '${prefijo}%' ORDER BY orden_id DESC LIMIT 1`;

    db.get(lastIdSql, [], (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Error al generar ID de orden: " + err.message });
        }
        
        let nextNumber = 1;
        // 2. Si ya existe un ID, extraer el número, sumarle 1
        if (row) {
            // Extrae la parte numérica del ID (ej. '001' de 'OT001') y la convierte a número
            nextNumber = parseInt(row.orden_id.substring(2)) + 1;
        }
        
        // 3. Formatear el nuevo número con ceros a la izquierda (ej. 2 -> "002")
        const newOrdenId = `${prefijo}${String(nextNumber).padStart(3, '0')}`;
        
        // 4. Insertar la nueva orden con el ID generado
        const insertSql = `INSERT INTO ordenes_trabajo (orden_id, cliente_cedula, placa, fecha, estado, ciudad_id) VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(insertSql, [newOrdenId, cliente_cedula, placa, fecha, estado, ciudad_id], function(err) {
            if (err) {
                return res.status(500).json({ error: "Error al crear la orden: " + err.message });
            }
            res.status(201).json({ message: `Orden ${newOrdenId} creada exitosamente.` });
        });
    });
};

// Actualizar el estado de una orden
exports.updateOrden = (req, res) => {
    const { orden_id } = req.params;
    const { estado } = req.body;

    const sql = `UPDATE ordenes_trabajo SET estado = ? WHERE orden_id = ?`;
    db.run(sql, [estado, orden_id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        res.status(200).json({ message: `Orden ${orden_id} actualizada.` });
    });
};