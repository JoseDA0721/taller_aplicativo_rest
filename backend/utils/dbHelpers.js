const db = require('../config/db');

const findClientNode = (cedula) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT ciudad_id FROM clientes WHERE cedula = ?`;
        db.get(sql, [cedula], (err, row) => {
            if (err) {
                const error = new Error("Error al buscar el cliente: " + err.message);
                error.statusCode = 500;
                reject(error);
            } else if (!row) {
                const notFound = new Error("Cliente no encontrado.");
                notFound.statusCode = 404;
                reject(notFound);
            } else {
                resolve(row.ciudad_id);
            }
        });
    });
};

module.exports = {
    findClientNode
};
