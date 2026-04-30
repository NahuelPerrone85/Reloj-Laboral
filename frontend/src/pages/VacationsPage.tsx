import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { vacationsService } from '../services/api';
import { Card, CardHeader, Button, Input } from '../components/ui';
import type { Vacation, VacationType, VacationStatus } from '../types';

const vacationTypeLabels: Record<VacationType, string> = {
  VACATION: 'Vacaciones',
  SICK_LEAVE: 'Baja médica',
  PERSONAL: 'Asunto personal',
  OTHER: 'Otro',
};

const vacationStatusLabels: Record<VacationStatus, string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  CANCELLED: 'Cancelado',
};

const statusColors: Record<VacationStatus, string> = {
  PENDING: 'bg-warning-100 text-warning-700',
  APPROVED: 'bg-success-100 text-success-700',
  REJECTED: 'bg-danger-100 text-danger-700',
  CANCELLED: 'bg-gray-100 text-gray-700',
};

const typeColors: Record<VacationType, string> = {
  VACATION: 'text-info-600',
  SICK_LEAVE: 'text-danger-600',
  PERSONAL: 'text-warning-600',
  OTHER: 'text-gray-600',
};

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

  const loadVacations = useCallback(async () => {
    try {
      const data = isAdmin
        ? await vacationsService.getPending()
        : await vacationsService.getMy();
      setVacations(data);
    } catch (err) {
      console.error('Error loading vacations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadVacations();
  }, [loadVacations]);

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

  const formatDate = (date: string) => new Date(date).toLocaleDateString('es-ES');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vacaciones y Ausencias</h1>
          <p className="text-gray-500 mt-1">Solicita y gestiona permisos</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          leftIcon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          }
        >
          {showForm ? 'Cancelar' : 'Nueva Solicitud'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader title="Nueva Solicitud" subtitle="Rellena los datos para crear una solicitud" />
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as VacationType })}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="VACATION">Vacaciones</option>
                  <option value="SICK_LEAVE">Baja médica</option>
                  <option value="PERSONAL">Asunto personal</option>
                  <option value="OTHER">Otro</option>
                </select>
              </div>
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Fecha inicio"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
                <Input
                  type="date"
                  label="Fecha fin"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Motivo</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  placeholder="Añade algún detalle adicional..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button type="submit">Enviar Solicitud</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <CardHeader
          title="Solicitudes"
          subtitle={`${vacations.length} solicitudes`}
        />

        {isLoading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-3">Cargando...</p>
          </div>
        ) : vacations.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500">No hay solicitudes</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fechas</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Motivo</th>
                  {isAdmin && <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vacations.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary-700">
                            {v.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{v.user?.name || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${typeColors[v.type]}`}>
                        {vacationTypeLabels[v.type]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(v.startDate)} - {formatDate(v.endDate)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[v.status]}`}>
                        {vacationStatusLabels[v.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {v.reason || '-'}
                    </td>
                    {isAdmin && v.status === 'PENDING' && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleStatus(v.id, 'APPROVED')}
                            className="text-sm font-medium text-success-600 hover:text-success-700"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleStatus(v.id, 'REJECTED')}
                            className="text-sm font-medium text-danger-600 hover:text-danger-700"
                          >
                            Rechazar
                          </button>
                        </div>
                      </td>
                    )}
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