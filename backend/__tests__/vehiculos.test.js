// backend/__tests__/vehiculos.test.js

const request = require('supertest');
const app = require('../app');

describe('API de Vehículos', () => {
    let nuevoClienteId;
    let nuevoVehiculoId;

    // Antes de todas las pruebas de vehículos, creamos un cliente para asociarlo.
    beforeAll(async () => {
        const nuevoCliente = {
            cedula: '0917372410',
            nombre: 'Cliente de Prueba',
            telefono: '0999999998',
            correo: 'prueba.vehiculo@test.com',
            ciudad_id: 1 // Asumimos que la ciudad con ID 1 ya existe
            
        };
        const res = await request(app).post('/api/cliente').send(nuevoCliente);
        console.log(res.body);
        nuevoClienteId = nuevoCliente.cedula; // Guardamos la cédula del cliente creado
    });

    // PRUEBA POST: Crear un nuevo vehículo
    describe('POST /api/vehiculo', () => {
        it('debería crear un nuevo vehículo y devolverlo', async () => {
            const nuevoVehiculo = {
                placa: 'TEST001',
                marca: 'Test Brand',
                modelo: 'Test Model',
                tipo_id: 1,
                cliente_cedula: nuevoClienteId
            };

            const res = await request(app)
                .post('/api/vehiculo')
                .send(nuevoVehiculo);
            expect(res.statusCode).toEqual(201);
            nuevoVehiculoId = nuevoVehiculo.placa; // Guardamos el ID para usarlo en otras pruebas
        });

        it('debería devolver un error 400 si faltan datos', async () => {
            const vehiculoIncompleto = { marca: 'Test Brand' };
            const res = await request(app)
                .post('/api/vehiculo')
                .send(vehiculoIncompleto);
            
            expect(res.statusCode).toEqual(400);
        });
    });

    // PRUEBA GET: Obtener todos los vehículos
    describe('GET /api/vehiculos', () => {
        it('debería devolver una lista de todos los vehículos', async () => {
            const res = await request(app).get('/api/vehiculos');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    // PRUEBA GET por ID: Obtener un vehículo específico
    describe('GET /api/vehiculo/:id', () => {
        it('debería devolver un vehículo específico por su ID', async () => {
            const res = await request(app).get(`/api/vehiculo/${nuevoVehiculoId}`);
            expect(res.statusCode).toEqual(200);
        });

        it('debería devolver un error 404 si el ID no existe', async () => {
            const res = await request(app).get('/api/vehiculo/99999');
            expect(res.statusCode).toEqual(404);
        });
    });
});