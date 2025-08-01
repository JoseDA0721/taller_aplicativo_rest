'use client'

import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface DetalleItem {
  nombre_item: string;
  cantidad: number;
  precio: number;
  tipo_item: 'Servicio' | 'Producto';
}

interface Orden {
  orden_id: string;
  total: number;
  detalles?: DetalleItem[];
}

interface Props {
  orden: Orden | null;
  onClose: () => void;
}

const DetallesOrdenModal: React.FC<Props> = ({ orden, onClose }) => {
  if (!orden) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
        >
          <FaTimes size={20} />
        </button>

        <h3 className="text-xl font-bold text-blue-800 mb-1">Detalles de la Orden</h3>
        <p className="text-lg font-semibold text-gray-700 mb-4">{orden.orden_id}</p>

        <div className="border rounded-md max-h-80 overflow-y-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-3 text-left font-medium text-gray-600">Ítem</th>
                <th className="p-3 text-center font-medium text-gray-600">Cantidad</th>
                <th className="p-3 text-right font-medium text-gray-600">Precio Unit.</th>
                <th className="p-3 text-right font-medium text-gray-600">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orden.detalles?.map((detalle, index) => (
                <tr key={index} className="border-b last:border-none hover:bg-gray-50">
                  <td className="p-3">
                    <span className="font-semibold text-gray-800">{detalle.nombre_item}</span>
                    <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${detalle.tipo_item === 'Servicio' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {detalle.tipo_item}
                    </span>
                  </td>
                  <td className="p-3 text-center text-gray-700">{detalle.cantidad}</td>
                  <td className="p-3 text-right text-gray-700">${detalle.precio.toFixed(2)}</td>
                  <td className="p-3 text-right text-gray-700 font-medium">${(detalle.precio * detalle.cantidad).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-end mt-4 pt-4 border-t">
            <span className="text-lg font-bold text-gray-800">Total:</span>
            <span className="text-lg font-bold text-gray-900 ml-4">${orden.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default DetallesOrdenModal;