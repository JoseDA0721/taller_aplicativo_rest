const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'taller.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    console.log("Creando tablas unificadas para SQLite...");

    // Tablas de catálogo
    db.run(`CREATE TABLE IF NOT EXISTS ciudades (id_ciudad INTEGER PRIMARY KEY, nombre TEXT NOT NULL)`);
    db.run(`CREATE TABLE IF NOT EXISTS formas_pago (forma_pago_id INTEGER PRIMARY KEY, metodo TEXT NOT NULL)`);
    db.run(`CREATE TABLE IF NOT EXISTS tipos_vehiculos (tipo_id INTEGER PRIMARY KEY, nombre TEXT NOT NULL)`);
    db.run(`CREATE TABLE IF NOT EXISTS productos (producto_id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, precio REAL NOT NULL)`);
    db.run(`CREATE TABLE IF NOT EXISTS servicios (servicio_id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, precio REAL NOT NULL)`);
    db.run(`CREATE TABLE IF NOT EXISTS servicios_productos(
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        servicio_id INT REFERENCES servicios(servicio_id), 
        producto_id INT REFERENCES productos(producto_id), 
        cantidad INT
    )`);

    // Tablas de datos
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
        cedula TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        telefono TEXT,
        correo TEXT,
        ciudad_id INTEGER,
        FOREIGN KEY (ciudad_id) REFERENCES ciudades(id_ciudad)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS vehiculos (
        placa TEXT PRIMARY KEY,
        tipo_id INTEGER,
        marca TEXT NOT NULL,
        modelo TEXT NOT NULL,
        cliente_cedula TEXT,
        FOREIGN KEY (tipo_id) REFERENCES tipos_vehiculos(tipo_id),
        FOREIGN KEY (cliente_cedula) REFERENCES clientes(cedula)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS ordenes_trabajo (
        orden_id TEXT PRIMARY KEY,
        cliente_cedula TEXT,
        placa TEXT,
        fecha TEXT NOT NULL,
        estado TEXT NOT NULL,
        ciudad_id INTEGER,
        forma_pago_id INTEGER,
        total REAL,
        FOREIGN KEY (cliente_cedula) REFERENCES clientes(cedula),
        FOREIGN KEY (placa) REFERENCES vehiculos(placa),
        FOREIGN KEY (ciudad_id) REFERENCES ciudades(id_ciudad),
        FOREIGN KEY (forma_pago_id) REFERENCES formas_pago(forma_pago_id)
    )`);
    

    db.run(`CREATE TABLE IF NOT EXISTS detalles_orden (
        detalle_id INTEGER PRIMARY KEY AUTOINCREMENT, 
        orden_id TEXT, 
        servicio_id INT, 
        producto_id INT, 
        cantidad INT, 
        precio NUMERIC,
        FOREIGN KEY (orden_id) REFERENCES ordenes_trabajo(orden_id)
    )`);

    console.log("Insertando datos de prueba...");

    // Datos de prueba
    db.run(`INSERT INTO ciudades VALUES (1, 'Quito'), (2, 'Guayaquil'), (3, 'Cuenca')`);
    db.run(`INSERT INTO formas_pago VALUES (1, 'Efectivo'), (2, 'Tarjeta'), (3, 'Transferencia')`);
    db.run(`INSERT INTO tipos_vehiculos VALUES (1, 'Sedán'), (2, 'SUV'), (3, 'Motocicleta')`);
    db.run(`INSERT INTO productos VALUES 
        (1, 'Aceite', 15.5),
        (2, 'Filtro de aire', 8.75),
        (3, 'Batería', 45.0)`);

    db.run(`INSERT INTO servicios VALUES 
        (1, 'Cambio de aceite', 25.0),
        (2, 'Alineación', 30.0),
        (3, 'Revisión general', 50.0)`);

    db.run(`INSERT INTO clientes VALUES 
        ('1723456789', 'Luis Pérez', '0991234567', 'luis@example.com', 1),
        ('0923456789', 'Ana Gómez', '0987654321', 'ana@example.com', 2)`);

    db.run(`INSERT INTO vehiculos VALUES 
        ('ABC1234', 1, 'Toyota', 'Corolla', '1723456789'),
        ('XYZ5678', 2, 'Hyundai', 'Tucson', '0923456789')`);
    
    db.run(`INSERT INTO ordenes_trabajo VALUES 
        ('OT001', '1723456789', 'ABC1234', '2025-07-31', 'Pendiente', 1, 1, 0),
        ('OT002', '0923456789', 'XYZ5678', '2025-07-30', 'Finalizado', 2, 2, 0)`);

    // Insertar detalles con precios y luego actualizar el total
    db.run(`INSERT INTO detalles_orden (orden_id, servicio_id, producto_id, cantidad, precio) VALUES 
        ('OT001', 1, 1, 1, 25.0), -- Cambio de aceite
        ('OT001', NULL, 1, 1, 15.5), -- Aceite
        ('OT001', NULL, 2, 1, 8.75),
        ('OT002', 3, 3, 1, 50.0), -- Revisión general
        ('OT002', NULL, 3, 1, 45.0)`);

    // Calcular y actualizar el total por orden
    const updateTotals = (callback) => {
        db.all(`SELECT orden_id, SUM(precio * cantidad) as total FROM detalles_orden GROUP BY orden_id`, (err, rows) => {
            if (err) return console.error(err.message);
    
            let remaining = rows.length;
            if (remaining === 0) return callback();
    
            rows.forEach((row) => {
                db.run(`UPDATE ordenes_trabajo SET total = ? WHERE orden_id = ?`, [row.total, row.orden_id], (err) => {
                    if (err) console.error(err.message);
                    remaining--;
                    if (remaining === 0) callback();
                });
            });
        });
    };

    updateTotals(() => {
        console.log("Totales actualizados correctamente.");
    
        db.close((err) => {
            if (err) return console.error(err.message);
            console.log('Base de datos creada y conexión cerrada.');
        });
    });
});
