const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Apunta al archivo de BD en la carpeta 'backend'
const DB_PATH = path.join(__dirname, '..', 'taller.sqlite');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error("Error al abrir la base de datos:", err.message);
        throw err;
    }
    console.log('Conectado a la base de datos SQLite.');
});

module.exports = db;