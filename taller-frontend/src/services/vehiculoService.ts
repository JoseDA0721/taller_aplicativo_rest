// --- Interfaces para un tipado estricto ---

// Describe los datos que se envían al backend para crear un vehículo
interface NewVehiculo {
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  cliente_id: string; // Cédula del cliente
  tipo_id: number;
}

// Describe la estructura de un vehículo tal como lo devuelve la API
interface VehiculoFromAPI {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  cliente_id: string;
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
 * SOLUCIÓN: Usamos la interfaz 'NewVehiculo' en lugar de 'any'.
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
      // Devuelve el mensaje de error específico del backend si está disponible
      return { success: false, message: errorData.message || 'Error desconocido al crear el vehículo.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error en createVehiculo:', error);
    // Devuelve un mensaje de error genérico y claro
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
