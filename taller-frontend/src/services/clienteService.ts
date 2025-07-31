const BASE_URL = 'http://localhost:5000/api';

export async function getClienteDetails(cedula: string) {
  try {
    // Hacemos dos peticiones en paralelo para eficiencia
    const [clienteRes, vehiculosRes] = await Promise.all([
      fetch(`${BASE_URL}/cliente/${cedula}`),
      fetch(`${BASE_URL}/vehiculo/cliente/${cedula}`)
    ]);

    if (!clienteRes.ok) {
      return { success: false, message: 'Cliente no encontrado.' };
    }

    const cliente = await clienteRes.json();
    // Los vehículos son opcionales, si no se encuentran, devolvemos un array vacío.
    const vehiculos = vehiculosRes.ok ? await vehiculosRes.json() : [];

    return { success: true, data: { cliente, vehiculos } };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Error de conexión.' };
  }
}

export async function getClientes() {
  try {
    const res = await fetch(`${BASE_URL}/clientes`);
    if (!res.ok) throw new Error('Error al obtener los clientes');
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function createCliente(cliente: any) {
  try {
    const res = await fetch(`${BASE_URL}/cliente`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente),
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, message: 'Error de conexión' };
  }
}

export async function deleteCliente(cedula: string) {
  try {
    const res = await fetch(`http://localhost:5000/api/cliente/${cedula}`, {
      method: 'DELETE',
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Error al eliminar cliente');
    return { success: true };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function updateCliente(cedula: string, cliente: any) {
  try {
    const res = await fetch(`http://localhost:5000/api/cliente/${cedula}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al actualizar cliente');
    return { success: true };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}