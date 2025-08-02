'use client'

import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { createVehiculo } from '@/services/vehiculoService';
import { fetchTiposVehiculo } from '@/services/catalogoApi'; // Asumimos que esta función existe en catalogoApi

// --- Interfaces para un tipado estricto ---
interface VehiculoFormProps {
  onClose: () => void;
  onCreated: () => void;
}

interface NewVehiculo {
  placa: string;
  marca: string;
  modelo: string;
  cliente_cedula: string;
  tipo_id: number;
}

interface TipoVehiculo {
    tipo_id: number;
    nombre: string;
}

export default function VehiculoFormModal({ onClose, onCreated }: VehiculoFormProps) {
  const [form, setForm] = useState({
    placa: '',
    marca: '',
    modelo: '',
    cliente_cedula: '',
    tipo_id: '1', // Valor por defecto
  });
  const [tiposVehiculo, setTiposVehiculo] = useState<TipoVehiculo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Carga los tipos de vehículo desde la BD cuando el modal se monta
  useEffect(() => {
    const loadTipos = async () => {
        try {
            const data = await fetchTiposVehiculo(); // Llama a la API
            setTiposVehiculo(data);
        } catch (err) {
            setError("No se pudieron cargar los tipos de vehículo.");
        }
    };
    loadTipos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.placa || !form.marca || !form.modelo || !form.cliente_cedula) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setIsLoading(true);

    // Creamos el payload con la estructura correcta, sin 'anio'
    const payload: NewVehiculo = {
      placa: form.placa,
      marca: form.marca,
      modelo: form.modelo,
      cliente_cedula: form.cliente_cedula,
      tipo_id: parseInt(form.tipo_id, 10),
    };

    const result = await createVehiculo(payload);

    if (result.success) {
      onCreated();
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
          <input name="placa" value={form.placa} onChange={handleChange} placeholder="Placa" className="border p-2 w-full rounded text-black" />
          <input name="marca" value={form.marca} onChange={handleChange} placeholder="Marca" className="border p-2 w-full rounded text-black" />
          <input name="modelo" value={form.modelo} onChange={handleChange} placeholder="Modelo" className="border p-2 w-full rounded text-black" />
          <input name="cliente_cedula" value={form.cliente_cedula} onChange={handleChange} placeholder="Cédula del Cliente" className="border p-2 w-full rounded text-black" />
          
          <div>
            <label htmlFor="tipo_id" className="block text-sm font-medium text-gray-700">Tipo de Vehículo</label>
            <select 
              name="tipo_id" 
              id="tipo_id" 
              value={form.tipo_id} 
              onChange={handleChange} 
              className="mt-1 block w-full border p-2 rounded text-black"
              disabled={tiposVehiculo.length === 0}
            >
              {tiposVehiculo.map(tipo => (
                <option key={tipo.tipo_id} value={tipo.tipo_id}>
                  {tipo.nombre}
                </option>
              ))}
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
