import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { clockingService } from '../services/api';
import type { Clocking } from '../types';

export const ClockingPage = () => {
  const { user } = useAuth();
  const [clockings, setClockings] = useState<Clocking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'ENTRY' | 'EXIT'>('all');

  useEffect(() => {
    if (user) {
      loadClockings();
    }
  }, [user]);

  const loadClockings = async () => {
    if (!user) return;
    try {
      const data = await clockingService.getByUser(user.id);
      setClockings(data);
    } catch (err) {
      setError('Error al cargar fichajes');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClockings = clockings.filter((c) => {
    if (filter === 'all') return true;
    return c.type === filter;
  });

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Historial de Fichajes</h1>
              <p className="mt-2 text-sm text-gray-700">
                Ver tu registro de entradas y salidas
              </p>
            </div>
          </div>

          <div className="mt-4 flex space-x-2">
            {(['all', 'ENTRY', 'EXIT'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === f
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'Todos' : f === 'ENTRY' ? 'Entradas' : 'Salidas'}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-6 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
                  {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Cargando...</div>
                  ) : filteredClockings.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No hay fichajes registrados
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Tipo
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Fecha/Hora
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Dispositivo
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Notas
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {filteredClockings.map((clocking) => (
                          <tr key={clocking.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                  clocking.type === 'ENTRY'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {clocking.type === 'ENTRY' ? 'Entrada' : 'Salida'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(clocking.timestamp).toLocaleString('es-ES', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {clocking.deviceInfo || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {clocking.notes || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};