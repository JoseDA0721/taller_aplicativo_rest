// --- Interfaces para un tipado estricto y correcto ---

// Describe los datos que se envían al backend para crear un vehículo.
// Corregido para coincidir con la estructura de tu API.
interface NewVehiculo {
  placa: string;
  marca: string;
  modelo: string;
  cliente_cedula: string; // Se usa la cédula del cliente
  tipo_id: number;
}

// Describe la estructura de un vehículo tal como lo devuelve la API
interface VehiculoFromAPI {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  cliente_cedula: string;
  tipo_id: number;
}

// --- Constante para la URL base de la API ---
const BASE_URL = 'http://localhost:5000/api';

/**
 * Obtiene una lista de todos los vehículos desde la API.
 */
export async function getVehiculos(): Promise<VehiculoFromAPI[]> {
  try {
    const res = await fetch(`${BASE_URL}/vehiculos`);
    if (!res.ok) {
      throw new Error('Error al obtener la lista de vehículos');
    }
    return await res.json();
  } catch (error) {
    console.error('Error en getVehiculos:', error);
    return []; // Devuelve un array vacío si ocurre un error
  }
}

/**
 * Crea un nuevo vehículo en la base de datos.
 */
export async function createVehiculo(vehiculo: NewVehiculo): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/vehiculo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehiculo),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, message: errorData.message || 'Error desconocido al crear el vehículo.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error en createVehiculo:', error);
    const message = error instanceof Error ? error.message : 'Error de conexión al crear el vehículo.';
    return { success: false, message };
  }
}

/**
 * Elimina un vehículo por su placa.
 */
export async function deleteVehiculo(placa: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/vehiculo/${placa}`, {
      method: 'DELETE'
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al eliminar el vehículo.');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error en deleteVehiculo:', error);
    const message = error instanceof Error ? error.message : 'Error de conexión al eliminar el vehículo.';
    return { success: false, message };
  }
}
