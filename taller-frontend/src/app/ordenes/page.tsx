'use client'

import React, { useEffect, useState, useCallback } from 'react'
import CrearOrdenModal from './CrearOrdenModal' 
import OrdenesTabla from './OrdenesTabla' 
import DetallesOrdenModal from './DetallesOrdenModal';

// --- Interfaces para tipado ---
interface DetalleItem {
  nombre_item: string;
  cantidad: number;
  precio: number;
  tipo_item: 'Servicio' | 'Producto';
}

interface Orden {
  orden_id: string;
  cliente_cedula: string;
  placa: string;
  fecha: string;
  estado: string;
  ciudad_id: number;
  forma_pago_id: number;
  total: number;
  detalles?: DetalleItem[];
}

// --- Componente principal de la página ---
export default function OrdenesPage() {
  // --- Estados ---
  const [todasLasOrdenes, setTodasLasOrdenes] = useState<Orden[]>([]) 
  const [ordenesMostradas, setOrdenesMostradas] = useState<Orden[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<Orden | null>(null);

  // --- Estados para los inputs de búsqueda ---
  const [busquedaId, setBusquedaId] = useState('')
  const [busquedaCedula, setBusquedaCedula] = useState('')

  const fetchOrdenes = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const res = await fetch('http://localhost:5000/api/ordenes')
      if (!res.ok) throw new Error('Error al conectar con el servidor.')
      
      const data: Orden[] = await res.json() // Le decimos a TS que esperamos un array de Orden
      const ordenesArray = Array.isArray(data) ? data : []
      
      setTodasLasOrdenes(ordenesArray)
      setOrdenesMostradas(ordenesArray)
    } catch (err) { // SOLUCIÓN: Eliminamos 'any' y tratamos 'err' como 'unknown'
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('No se pudieron cargar las órdenes.')
      }
      console.error(err)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    fetchOrdenes()
  }, [fetchOrdenes])

  // --- Lógica de Búsqueda ---
  const handleBuscar = () => {
    let resultado = todasLasOrdenes;
    if (busquedaId) {
        resultado = resultado.filter(o => o.orden_id.toLowerCase().includes(busquedaId.toLowerCase()));
    }
    if (busquedaCedula) {
        resultado = resultado.filter(o => o.cliente_cedula.includes(busquedaCedula));
    }
    setOrdenesMostradas(resultado);
  };
  
  const limpiarBusqueda = () => {
    setBusquedaId('')
    setBusquedaCedula('')
    setOrdenesMostradas(todasLasOrdenes)
  }

  // --- Lógica para actualizar estado de una orden ---
  const handleEstadoChange = async (ordenId: string, nuevoEstado: string) => {
    // Función auxiliar para actualizar el estado localmente
    const actualizarOrdenLocal = (ordenes: Orden[]) =>
        ordenes.map(o => (o.orden_id === ordenId ? { ...o, estado: nuevoEstado } : o));

    // Optimistic UI: Actualizamos la UI inmediatamente
    setTodasLasOrdenes(actualizarOrdenLocal);
    setOrdenesMostradas(actualizarOrdenLocal);

    try {
      const res = await fetch(`http://localhost:5000/api/orden/${ordenId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      })
      if (!res.ok) throw new Error('No se pudo actualizar el estado en el servidor.')
    
    } catch (error) {
      console.error('Error al cambiar estado:', error)
      alert('No se pudo actualizar el estado de la orden. Revirtiendo cambios.')
      // Si hay un error, revertimos los cambios en la UI
      fetchOrdenes(); 
    }
  }

  // --- Lógica para ver detalles ---
  const handleVerDetalles = async (ordenId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orden/detalles/${ordenId}`);
      if (!res.ok) throw new Error('No se pudieron cargar los detalles.');
      
      const detallesData: DetalleItem[] = await res.json();
      const ordenCompleta = todasLasOrdenes.find(o => o.orden_id === ordenId);

      if (ordenCompleta) {
        setOrdenSeleccionada({ ...ordenCompleta, detalles: detallesData });
      }
    } catch (err) { // SOLUCIÓN: Eliminamos 'any' y tratamos 'err' como 'unknown'
        const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido.';
        alert(errorMessage);
        console.error(err);
    }
  };

  const cerrarModal = () => {
    setOrdenSeleccionada(null);
  };
  
  // --- Renderizado del componente ---
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-3xl font-bold text-[#001A30]">Órdenes de Trabajo</h2>
        <CrearOrdenModal onSuccess={fetchOrdenes} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col">
            <label htmlFor="search-id" className="text-sm font-medium text-gray-600 mb-1">Buscar por ID</label>
            <input
              id="search-id"
              type="text"
              placeholder="Ej: OT001"
              value={busquedaId}
              onChange={(e) => setBusquedaId(e.target.value)}
              className="border border-gray-300 p-2 rounded text-sm text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="search-cedula" className="text-sm font-medium text-gray-600 mb-1">Buscar por Cédula</label>
            <input
              id="search-cedula"
              type="text"
              placeholder="Ej: 1723..."
              value={busquedaCedula}
              onChange={(e) => setBusquedaCedula(e.target.value)}
              className="border border-gray-300 p-2 rounded text-sm text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBuscar}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition w-full"
            >
              Buscar
            </button>
            <button
              onClick={limpiarBusqueda}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded font-medium transition w-full"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow bg-white border border-gray-200">
        {cargando ? (
          <p className="p-4 text-center text-gray-500">Cargando órdenes...</p>
        ) : error ? (
          <p className="p-4 text-center text-red-500">{error}</p>
        ) : (
          <OrdenesTabla
            ordenes={ordenesMostradas}
            onEstadoChange={handleEstadoChange}
            onVerDetalles={handleVerDetalles}
          />
        )}
      </div>

      <DetallesOrdenModal orden={ordenSeleccionada} onClose={cerrarModal} />
    </div>
  )
}