// --- Interfaces para un tipado estricto ---

interface Cliente {
  id?: number; // El ID es opcional, especialmente al crear
  cedula: string;
  nombre: string;
  telefono: string;
  correo: string;
  ciudad_id: number;
}

interface VehiculoSimple {
  placa: string;
  marca: string;
  modelo: string;
}

interface ClienteDetails {
  cliente: Cliente;
  vehiculos: VehiculoSimple[];
}

// --- Constante para la URL base de la API ---
const BASE_URL = 'http://localhost:5000/api';

/**
* Obtiene los detalles completos de un cliente, incluyendo sus vehículos.
*/
export async function getClienteDetails(cedula: string): Promise<{ success: boolean; data?: ClienteDetails; message?: string }> {
try {
  const [clienteRes, vehiculosRes] = await Promise.all([
    fetch(`${BASE_URL}/cliente/${cedula}`),
    fetch(`${BASE_URL}/vehiculo/cliente/${cedula}`)
  ]);

  if (!clienteRes.ok) {
    return { success: false, message: 'Cliente no encontrado.' };
  }

  const cliente: Cliente = await clienteRes.json();
  const vehiculos: VehiculoSimple[] = vehiculosRes.ok ? await vehiculosRes.json() : [];

  return { success: true, data: { cliente, vehiculos } };
} catch (error) {
  console.error('Error en getClienteDetails:', error);
  return { success: false, message: 'Error de conexión al obtener detalles del cliente.' };
}
}

/**
* Obtiene una lista de todos los clientes.
*/
export async function getClientes(): Promise<Cliente[]> {
try {
  const res = await fetch(`${BASE_URL}/clientes`);
  if (!res.ok) throw new Error('Error al obtener los clientes');
  return await res.json();
} catch (error) {
  console.error('Error en getClientes:', error);
  return []; // Devuelve un array vacío en caso de error
}
}

/**
* Crea un nuevo cliente.
* SOLUCIÓN: Usamos la interfaz 'Cliente' en lugar de 'any'.
* Omitimos 'id' porque es generado por la base de datos.
*/
export async function createCliente(cliente: Omit<Cliente, 'id'>): Promise<{ success: boolean; message?: string }> {
try {
  const res = await fetch(`${BASE_URL}/cliente`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cliente),
  });

  if (!res.ok) {
    const errorData = await res.json();
    return { success: false, message: errorData.message || 'Error desconocido al crear el cliente.' };
  }

  return { success: true };
} catch (error) {
  console.error('Error en createCliente:', error);
  const message = error instanceof Error ? error.message : 'Error de conexión.';
  return { success: false, message };
}
}

/**
* Elimina un cliente por su cédula.
*/
export async function deleteCliente(cedula: string): Promise<{ success: boolean; message?: string }> {
try {
  const res = await fetch(`${BASE_URL}/cliente/${cedula}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al eliminar cliente');
  }
  return { success: true };
} catch (error) {
  const message = error instanceof Error ? error.message : 'Error de conexión.';
  return { success: false, message };
}
}

/**
* Actualiza los datos de un cliente.
* SOLUCIÓN: Usamos 'Partial<Cliente>' para indicar que se pueden enviar solo algunos campos.
*/
export async function updateCliente(cedula: string, clienteData: Partial<Omit<Cliente, 'id' | 'cedula'>>): Promise<{ success: boolean; message?: string }> {
try {
  const res = await fetch(`${BASE_URL}/cliente/${cedula}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clienteData),
  });

  if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al actualizar cliente');
  }
  return { success: true };
} catch (error) {
  const message = error instanceof Error ? error.message : 'Error de conexión.';
  return { success: false, message };
}
}