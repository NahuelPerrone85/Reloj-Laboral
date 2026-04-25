import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { projectsService } from '../services/api';
import type { Project } from '../types';

export const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
  });

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    try {
      const data = await projectsService.getAll();
      setProjects(data);
    } catch (err) {
      setError('Error al cargar proyectos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await projectsService.create({
        ...newProject,
        companyId: user?.companyId || '',
        active: true,
      });
      setNewProject({ name: '', description: '', color: '#3B82F6' });
      setShowForm(false);
      loadProjects();
    } catch (err) {
      setError('Error al crear proyecto');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      return;
    }

    try {
      await projectsService.delete(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      setError('Error al eliminar proyecto');
    }
  };

  const colors = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
  ];

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
              <h1 className="text-2xl font-semibold text-gray-900">Proyectos</h1>
              <p className="mt-2 text-sm text-gray-700">
                Gestiona los proyectos de tu empresa
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {showForm ? 'Cancelar' : 'Nuevo proyecto'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleCreate} className="mt-6 bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre del proyecto
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    value={newProject.name}
                    onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Descripción
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({ ...newProject, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Color</label>
                  <div className="mt-2 flex space-x-2">
                    {colors.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setNewProject({ ...newProject, color: c.value })}
                        className={`w-8 h-8 rounded-full ${
                          newProject.color === c.value ? 'ring-2 ring-offset-2' : ''
                        }`}
                        style={{ backgroundColor: c.value }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Crear proyecto
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
            ) : projects.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                No hay proyectos registrados
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="relative rounded-lg border border-gray-200 bg-white px-6 py-5 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div
                      className="flex-shrink-0 w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="text-xs text-gray-500">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(project.id)}
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