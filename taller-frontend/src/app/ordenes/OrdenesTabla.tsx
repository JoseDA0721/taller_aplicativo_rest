import React from 'react'

// --- Interfaces de Tipos ---
interface Orden {
  orden_id: string
  cliente_cedula: string
  placa: string
  fecha: string
  estado: string
  ciudad_id: number
  forma_pago_id: number
  total: number
}

interface Props {
  ordenes: Orden[]
  onEstadoChange: (ordenId: string, nuevoEstado: string) => void
  onVerDetalles: (ordenId: string) => void; // <-- Prop para manejar el clic
}

// --- Funciones Auxiliares ---
const getNombreCiudad = (id: number): string => {
  switch (id) {
    case 1: return 'Quito'
    case 2: return 'Guayaquil'
    case 3: return 'Cuenca'
    default: return 'Desconocida'
  }
}

const getNombrePago = (id: number): string => {
    switch (id) {
      case 1: return 'Efectivo'
      case 2: return 'Tarjeta'
      case 3: return 'Transferencia'
      default: return 'Otro'
    }
}

// --- Componente de la Tabla ---
const OrdenesTabla: React.FC<Props> = ({ ordenes, onEstadoChange, onVerDetalles }) => {
  if (!ordenes || ordenes.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No se encontraron órdenes que coincidan con la búsqueda.</p>
      </div>
    )
  }

  return (
    <table className="min-w-full text-sm">
      <thead className="bg-gray-100 text-gray-700 font-medium">
        <tr>
          <th className="p-3 text-left">ID Orden</th>
          <th className="p-3 text-left">Cédula Cliente</th>
          <th className="p-3 text-left">Placa</th>
          <th className="p-3 text-left">Fecha</th>
          <th className="p-3 text-left">Total</th>
          <th className="p-3 text-left">Ciudad</th>
          <th className="p-3 text-left">Forma de Pago</th>
          <th className="p-3 text-left">Estado</th>
          <th className="p-3 text-left">Acciones</th> {/* <-- Nueva columna */}
        </tr>
      </thead>
      <tbody>
        {ordenes.map((orden) => (
          <tr key={orden.orden_id} className="border-b hover:bg-gray-50 transition-colors">
            <td className="p-3 font-semibold text-[#001A30]">{orden.orden_id}</td>
            <td className="p-3 text-gray-800">{orden.cliente_cedula}</td>
            <td className="p-3 text-gray-800">{orden.placa}</td>
            <td className="p-3 text-gray-800">{new Date(orden.fecha).toLocaleDateString()}</td>
            <td className="p-3 font-medium text-gray-900">${orden.total.toFixed(2)}</td>
            <td className="p-3">
              <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800 font-semibold">
                {getNombreCiudad(orden.ciudad_id)}
              </span>
            </td>
            <td className="p-3 text-gray-800">{getNombrePago(orden.forma_pago_id)}</td>
            <td className="p-3">
              <select
                value={orden.estado}
                onChange={(e) => onEstadoChange(orden.orden_id, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Recibida">Recibida</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Finalizada">Finalizada</option>
              </select>
            </td>
            <td className="p-3"> {/* <-- Nueva celda con el botón */}
              <button
                onClick={() => onVerDetalles(orden.orden_id)}
                className="text-blue-600 hover:text-blue-800 font-semibold text-xs"
              >
                Ver Detalles
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default OrdenesTabla;
