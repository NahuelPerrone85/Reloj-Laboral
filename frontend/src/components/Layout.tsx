import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-primary-600">Reloj Laboral</span>
              </Link>
              {user && (
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    to="/dashboard"
                    className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/clocking"
                    className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Fichar
                  </Link>
                  <Link
                    to="/vacations"
                    className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Vacaciones
                  </Link>
                  {user.role === 'ADMIN' && (
                    <>
                      <Link
                        to="/users"
                        className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Empleados
                      </Link>
                      <Link
                        to="/companies"
                        className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Empresas
                      </Link>
                      <Link
                        to="/projects"
                        className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Proyectos
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};