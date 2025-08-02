'use client'

import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { createVehiculo } from '@/services/vehiculoService';

// --- Interfaces para un tipado estricto ---
interface VehiculoFormProps {
  onClose: () => void;
  onCreated: () => void;
}

interface NewVehiculo {
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  cliente_id: string; // Cédula del cliente
  tipo_id: number;
}

export default function VehiculoFormModal({ onClose, onCreated }: VehiculoFormProps) {
  const [form, setForm] = useState({
    placa: '',
    marca: '',
    modelo: '',
    anio: '', // SOLUCIÓN: Añadimos 'anio' al estado del formulario
    cliente_cedula: '',
    tipo_id: '1', // Valor por defecto para el select
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación simple de campos
    if (!form.placa || !form.marca || !form.modelo || !form.anio || !form.cliente_cedula) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setIsLoading(true);

    // SOLUCIÓN: Creamos el objeto 'payload' con la estructura correcta
    const payload: NewVehiculo = {
      placa: form.placa,
      marca: form.marca,
      modelo: form.modelo,
      anio: parseInt(form.anio, 10), // Convertimos el año a número
      cliente_id: form.cliente_cedula, // Mapeamos cliente_cedula a cliente_id
      tipo_id: parseInt(form.tipo_id, 10),
    };

    const result = await createVehiculo(payload);

    if (result.success) {
      onCreated(); // Llama a la función para refrescar la lista
    } else {
      setError(result.message || 'Ocurrió un error al crear el vehículo.');
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <Dialog.Title className="text-2xl font-bold text-blue-700 mb-4">Nuevo Vehículo</Dialog.Title>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="placa" value={form.placa} onChange={handleChange} placeholder="Placa" className="border p-2 w-full rounded" />
          <input name="marca" value={form.marca} onChange={handleChange} placeholder="Marca" className="border p-2 w-full rounded" />
          <input name="modelo" value={form.modelo} onChange={handleChange} placeholder="Modelo" className="border p-2 w-full rounded" />
          {/* SOLUCIÓN: Añadimos el input para el año */}
          <input name="anio" type="number" value={form.anio} onChange={handleChange} placeholder="Año" className="border p-2 w-full rounded" />
          <input name="cliente_cedula" value={form.cliente_cedula} onChange={handleChange} placeholder="Cédula del Cliente" className="border p-2 w-full rounded" />
          
          <div>
            <label htmlFor="tipo_id" className="block text-sm font-medium text-gray-700">Tipo de Vehículo</label>
            <select name="tipo_id" id="tipo_id" value={form.tipo_id} onChange={handleChange} className="mt-1 block w-full border p-2 rounded">
              <option value="1">Sedán</option>
              <option value="2">SUV</option>
              <option value="3">Pickup</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 rounded font-semibold">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold disabled:bg-blue-300">
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </Dialog.Panel>
    </Dialog>
  );
}
