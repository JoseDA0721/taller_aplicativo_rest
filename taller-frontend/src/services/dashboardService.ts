const BASE_URL = 'http://localhost:5000/api';

export async function fetchDashboardStats() {
  try {

    const [clientesRes, vehiculosRes, ordenesRes] = await Promise.all([
      fetch(`${BASE_URL}/clientes`),
      fetch(`${BASE_URL}/vehiculos`),
      fetch(`${BASE_URL}/ordenes`),
    ]);

    if (!clientesRes.ok || !vehiculosRes.ok || !ordenesRes.ok) {
      throw new Error('Error al obtener datos del dashboard');
    }

    const clientes = await clientesRes.json();
    const vehiculos = await vehiculosRes.json();
    const ordenes = await ordenesRes.json();

    return {
      totalClientes: clientes.length,
      totalVehiculos: vehiculos.length,
      totalOrdenes: ordenes.length,
    };
  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    return {
      totalClientes: 0,
      totalVehiculos: 0,
      totalOrdenes: 0,
    };
  }
}