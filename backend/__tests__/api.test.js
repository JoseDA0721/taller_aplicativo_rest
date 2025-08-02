/* eslint-env jest */
const request = require('supertest');
const app = require('../app'); // <-- ¡Esta es la ruta corregida!

describe('Pruebas de la API', () => {

  describe('GET /', () => {
    it('debería responder con el mensaje de bienvenida y estado 200', async () => {
      const response = await request(app).get('/');
      
      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('API del Sistema de Taller Mecánico funcionando correctamente.');
    });
  });

  // Puedes añadir pruebas para otras rutas aquí, por ejemplo:
  describe('GET /api/clientes', () => {
    it('debería devolver una lista de clientes', async () => {
        const response = await request(app).get('/api/clientes');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true); // Verificamos que la respuesta sea un array
    });
  });

});