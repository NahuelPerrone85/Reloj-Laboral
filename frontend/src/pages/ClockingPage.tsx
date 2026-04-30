import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { clockingService } from '../services/api';
import { Card, CardHeader } from '../components/ui';
import type { Clocking } from '../types';

export const ClockingPage = () => {
  const { user } = useAuth();
  const [clockings, setClockings] = useState<Clocking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'ENTRY' | 'EXIT'>('all');

  const loadClockings = useCallback(async () => {
    if (!user) return;
    try {
      const data = await clockingService.getByUser(user.id);
      setClockings(data);
    } catch (err) {
      setError('Error al cargar fichajes');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadClockings();
    }
  }, [user, loadClockings]);

  const filteredClockings = clockings.filter((c) => {
    if (filter === 'all') return true;
    return c.type === filter;
  });

  const filterButtons = [
    { value: 'all', label: 'Todos' },
    { value: 'ENTRY', label: 'Entradas' },
    { value: 'EXIT', label: 'Salidas' },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historial de Fichajes</h1>
          <p className="text-gray-500 mt-1">Ver tu registro de entradas y salidas</p>
        </div>
      </div>

      <Card>
        <CardHeader
          title="Fichajes"
          subtitle={`${filteredClockings.length} registros`}
          action={
            <div className="flex gap-2">
              {filterButtons.map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setFilter(btn.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === btn.value
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          }
        />

        {error && (
          <div className="mb-4 p-4 bg-danger-50 border border-danger-200 rounded-lg">
            <p className="text-sm text-danger-600">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-3">Cargando...</p>
          </div>
        ) : filteredClockings.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500">No hay fichajes registrados</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Fecha/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Dispositivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Notas
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredClockings.map((clocking) => (
                  <tr key={clocking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          clocking.type === 'ENTRY' ? 'bg-success-100' : 'bg-danger-100'
                        }`}>
                          {clocking.type === 'ENTRY' ? (
                            <svg className="w-4 h-4 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-danger-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          )}
                        </div>
                        <span className={`font-medium ${
                          clocking.type === 'ENTRY' ? 'text-success-700' : 'text-danger-700'
                        }`}>
                          {clocking.type === 'ENTRY' ? 'Entrada' : 'Salida'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(clocking.timestamp).toLocaleString('es-ES', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {clocking.deviceInfo || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {clocking.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};