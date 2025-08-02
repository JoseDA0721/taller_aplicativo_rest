'use client'

import React, { useEffect, useState, ReactNode } from 'react'

// --- Interfaces de Datos ---
// Definimos tipos claros para nuestros datos.
interface Servicio {
  servicio_id: number
  nombre: string
  precio: number | string
}

interface Producto {
  producto_id: number
  nombre: string
  precio: number | string
}

// Un tipo de unión para manejar ambos tipos de datos de forma genérica.
type CatalogoItem = Servicio | Producto;

// --- Componente de Tabla Genérico ---
// Creamos un componente reutilizable para mostrar las tablas.
interface CatalogoTableProps {
  title: string;
  columns: string[];
  data: CatalogoItem[];
  renderRow: (item: CatalogoItem) => ReactNode[];
}

const CatalogoTable: React.FC<CatalogoTableProps> = ({ title, columns, data, renderRow }) => (
  <div className="bg-white shadow-md rounded-lg p-5">
    <h3 className="text-xl font-semibold text-[#001A30] mb-4 border-b pb-2">{title}</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-blue-100 text-blue-900 font-medium">
          <tr>
            {columns.map((col) => (
              // SOLUCIÓN: Usamos el nombre de la columna como clave, ya que es único en la cabecera.
              <th key={col} className="p-3 text-left">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            // SOLUCIÓN: Usamos el ID único del item (servicio_id o producto_id) como clave.
            const key = 'servicio_id' in item ? item.servicio_id : item.producto_id;
            return (
              <tr key={key} className="border-b hover:bg-gray-50">
                {renderRow(item).map((cell, index) => (
                  // Usamos el índice aquí porque las celdas de una fila no tienen un ID único.
                  <td key={index} className="p-3 text-[#1a1a1a]">{cell}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);


// --- Componente Principal de la Página ---
export default function CatalogoPage() {
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [productos, setProductos] = useState<Producto[]>([])

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [serviciosRes, productosRes] = await Promise.all([
          fetch('http://localhost:5000/api/servicios'),
          fetch('http://localhost:5000/api/productos')
        ]);

        if (!serviciosRes.ok || !productosRes.ok) {
            throw new Error('Error en la respuesta de la red');
        }

        const serviciosData = await serviciosRes.json();
        const productosData = await productosRes.json();

        setServicios(serviciosData);
        setProductos(productosData);
      } catch (error) {
        console.error('Error al cargar catálogo:', error);
      }
    }

    fetchAll();
  }, []);

  return (
    <div className="space-y-10 p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-[#001A30]">Catálogo</h2>

      <CatalogoTable
        title="Servicios"
        columns={['ID', 'Nombre', 'Precio']}
        data={servicios}
        renderRow={(item) => {
          const servicio = item as Servicio; // TypeScript sabe que este item es un Servicio
          return [
            servicio.servicio_id,
            servicio.nombre,
            <span key="precio" className="text-green-700 font-semibold">${Number(servicio.precio).toFixed(2)}</span>
          ];
        }}
      />

      <CatalogoTable
        title="Productos"
        columns={['ID', 'Nombre', 'Precio']}
        data={productos}
        renderRow={(item) => {
          const producto = item as Producto; // TypeScript sabe que este item es un Producto
          return [
            producto.producto_id,
            producto.nombre,
            <span key="precio" className="text-green-700 font-semibold">${Number(producto.precio).toFixed(2)}</span>,
          ];
        }}
      />
    </div>
  )
}