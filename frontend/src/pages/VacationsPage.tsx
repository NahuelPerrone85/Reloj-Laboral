import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { vacationsService } from '../services/api';
import { Layout } from '../components/Layout';
import type { Vacation, VacationType, VacationStatus } from '../types';

export const VacationsPage = () => {
  const { user } = useAuth();
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'VACATION' as VacationType,
    startDate: '',
    endDate: '',
    reason: '',
  });

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    loadVacations();
  }, [user]);

  const loadVacations = async () => {
    try {
      const data = isAdmin ? await vacationsService.getAll() : await vacationsService.getMy();
      setVacations(data);
    } catch (err) {
      console.error('Error loading vacations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await vacationsService.create(formData);
      setShowForm(false);
      setFormData({ type: 'VACATION', startDate: '', endDate: '', reason: '' });
      loadVacations();
    } catch (err) {
      console.error('Error creating vacation:', err);
    }
  };

  const handleStatus = async (id: string, status: VacationStatus) => {
    try {
      await vacationsService.update(id, { status });
      loadVacations();
    } catch (err) {
      console.error('Error updating vacation:', err);
    }
  };

  const getStatusColor = (status: VacationStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: VacationType) => {
    switch (type) {
      case 'VACATION': return 'Vacaciones';
      case 'SICK_LEAVE': return 'Baja médica';
      case 'PERSONAL': return 'Asunto personal';
      case 'OTHER': return 'Otro';
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('es-ES');

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Vacaciones y Ausencias</h1>
              <p className="mt-2 text-sm text-gray-700">
                Solicita y gestiona permisos
              </p>
            </div>
            {!isAdmin && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="mt-4 sm:mt-0 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                {showForm ? 'Cancelar' : 'Nueva Solicitud'}
              </button>
            )}
          </div>

          {showForm && (
            <div className="mt-6 bg-white shadow sm:rounded-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as VacationType })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="VACATION">Vacaciones</option>
                    <option value="SICK_LEAVE">Baja médica</option>
                    <option value="PERSONAL">Asunto personal</option>
                    <option value="OTHER">Otro</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha inicio</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha fin</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Motivo</label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Enviar Solicitud
                </button>
              </form>
            </div>
          )}

          <div className="mt-6">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Cargando...</div>
            ) : vacations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No hay solicitudes</div>
            ) : (
              <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inicio</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fin</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                      {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {vacations.map((v) => (
                      <tr key={v.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {v.user?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getTypeLabel(v.type)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(v.startDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(v.endDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${getStatusColor(v.status)}`}>
                            {v.status}
                          </span>
                        </td>
                        {isAdmin && v.status === 'PENDING' && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                            <button
                              onClick={() => handleStatus(v.id, 'APPROVED')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Aprobar
                            </button>
                            <button
                              onClick={() => handleStatus(v.id, 'REJECTED')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Rechazar
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};