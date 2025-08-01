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
exports.createOrden = async (req, res) => {
    const { cliente_cedula, placa, fecha, estado, ciudad_id, forma_pago_id, detalles } = req.body;

    if (!cliente_cedula || !placa || !ciudad_id || !detalles || !detalles.length) {
        return res.status(400).json({ message: 'Faltan datos críticos (cliente, placa, ciudad o detalles).' });
    }

    try {
        // Iniciar transacción
        await new Promise((resolve, reject) => db.run('BEGIN', (err) => err ? reject(err) : resolve()));

        // 1. Procesar los detalles para expandir los servicios en productos
        const finalDetails = [];
        let totalOrden = 0;

        for (const item of detalles) {
            if (item.servicio_id) {
                // Añadir el servicio principal a la lista de detalles y al total
                finalDetails.push({
                    servicio_id: item.servicio_id,
                    producto_id: null,
                    cantidad: 1,
                    precio: item.precio 
                });
                totalOrden += item.precio;

                // Buscar productos asociados al servicio en la "receta"
                const recetaSql = `
                    SELECT sp.producto_id, p.precio, sp.cantidad 
                    FROM servicios_productos sp
                    JOIN productos p ON sp.producto_id = p.producto_id
                    WHERE sp.servicio_id = ?`;
                
                const productosDelServicio = await new Promise((resolve, reject) => {
                    db.all(recetaSql, [item.servicio_id], (err, rows) => err ? reject(err) : resolve(rows));
                });

                // Añadir cada producto de la receta a los detalles y al total
                for (const producto of productosDelServicio) {
                    finalDetails.push({
                        servicio_id: null,
                        producto_id: producto.producto_id,
                        cantidad: producto.cantidad,
                        precio: producto.precio
                    });
                    totalOrden += producto.precio * producto.cantidad;
                }

            } else if (item.producto_id) {
                // Añadir un producto directo a la lista y al total
                finalDetails.push(item);
                totalOrden += item.precio * item.cantidad;
            }
        }

        // 2. Generar el nuevo ID de la orden
        const lastIdSql = `SELECT orden_id FROM ordenes_trabajo ORDER BY orden_id DESC LIMIT 1`;
        const lastIdRow = await new Promise((resolve, reject) => {
            db.get(lastIdSql, [], (err, row) => err ? reject(err) : resolve(row));
        });
        
        let nextNumber = 1;
        if (lastIdRow) {
            nextNumber = parseInt(lastIdRow.orden_id.substring(2)) + 1;
        }
        const newOrdenId = `OT${String(nextNumber).padStart(3, '0')}`;

        // 3. Insertar la cabecera de la orden con el total ya calculado
        const ordenQuery = `
            INSERT INTO ordenes_trabajo (orden_id, cliente_cedula, placa, fecha, estado, ciudad_id, forma_pago_id, total) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        await new Promise((resolve, reject) => {
            db.run(ordenQuery, [newOrdenId, cliente_cedula, placa, fecha, estado, ciudad_id, forma_pago_id, totalOrden], (err) => {
                err ? reject(err) : resolve();
            });
        });

        // 4. Insertar todos los detalles (servicios y productos) en la base de datos
        const detalleInsertStmt = db.prepare('INSERT INTO detalles_orden (orden_id, servicio_id, producto_id, cantidad, precio) VALUES (?, ?, ?, ?, ?)');
        for (const detalle of finalDetails) {
            detalleInsertStmt.run(newOrdenId, detalle.servicio_id, detalle.producto_id, detalle.cantidad, detalle.precio);
        }
        await new Promise((resolve, reject) => {
            detalleInsertStmt.finalize(err => err ? reject(err) : resolve());
        });

        // Confirmar la transacción
        await new Promise((resolve, reject) => db.run('COMMIT', (err) => err ? reject(err) : resolve()));
        
        res.status(201).json({ message: `Orden ${newOrdenId} creada con todos sus productos. Total: ${totalOrden.toFixed(2)}` });

    } catch (err) {
        // Si algo falla, revertir todos los cambios
        await new Promise((resolve) => db.run('ROLLBACK', () => resolve()));
        console.error('Error en la transacción:', err);
        res.status(500).json({ error: 'Error en la transacción de la orden: ' + err.message });
    }
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

exports.getDetallesOrden = (req, res) => {
    const { orden_id } = req.params;

    // Esta consulta une los detalles con las tablas de servicios y productos
    // para obtener los nombres de los items.
    const sql = `
        SELECT
            d.detalle_id,
            d.cantidad,
            d.precio,
            COALESCE(s.nombre, p.nombre) as nombre_item,
            CASE
                WHEN d.servicio_id IS NOT NULL THEN 'Servicio'
                ELSE 'Producto'
            END as tipo_item
        FROM detalles_orden d
        LEFT JOIN servicios s ON d.servicio_id = s.servicio_id
        LEFT JOIN productos p ON d.producto_id = p.producto_id
        WHERE d.orden_id = ?
    `;

    db.all(sql, [orden_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
}