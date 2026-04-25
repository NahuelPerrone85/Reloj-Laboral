import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { companiesService } from '../services/api';
import type { Company } from '../types';

export const CompaniesPage = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '' });

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadCompanies();
    }
  }, [user]);

  const loadCompanies = async () => {
    try {
      const data = await companiesService.getAll();
      setCompanies(data);
    } catch (err) {
      setError('Error al cargar empresas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await companiesService.create(newCompany);
      setNewCompany({ name: '' });
      setShowForm(false);
      loadCompanies();
    } catch (err) {
      setError('Error al crear empresa');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta empresa?')) {
      return;
    }

    try {
      await companiesService.delete(id);
      setCompanies(companies.filter((c) => c.id !== id));
    } catch (err) {
      setError('Error al eliminar empresa');
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">No tienes acceso a esta página</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Empresas</h1>
              <p className="mt-2 text-sm text-gray-700">
                Gestiona las empresas del sistema
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {showForm ? 'Cancelar' : 'Nueva empresa'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleCreate} className="mt-6 bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre de la empresa
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    value={newCompany.name}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, name: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Crear empresa
                </button>
              </div>
            </form>
          )}

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <div className="col-span-full text-center text-gray-500">Cargando...</div>
            ) : companies.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                No hay empresas registradas
              </div>
            ) : (
              companies.map((company) => (
                <div
                  key={company.id}
                  className="relative rounded-lg border border-gray-200 bg-white px-6 py-5 shadow-sm flex items-center justify-between hover:border-gray-300"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {company.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Creada: {new Date(company.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(company.id)}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};