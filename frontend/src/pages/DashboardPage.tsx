import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useGeolocation } from '../hooks/useGeolocation';
import { clockingService, reportsService, type DailyReport, type WeeklyReport, type MonthlyReport } from '../services/api';
import type { Clocking } from '../types';

export const DashboardPage = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { getLocation } = useGeolocation();
  const [todayClockings, setTodayClockings] = useState<Clocking[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [lastStatus, setLastStatus] = useState<string>('');
  const [dailyReport, setDailyReport] = useState<DailyReport | null>(null);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      loadTodayClockings();
      loadReports();
    }
  }, [user]);

  const loadTodayClockings = async () => {
    if (!user) return;
    try {
      const clockings = await clockingService.getToday(user.id);
      setTodayClockings(clockings);
      if (clockings.length > 0) {
        setLastStatus(clockings[clockings.length - 1].type);
      }
    } catch (err) {
      console.error('Error loading clockings:', err);
    }
  };

  const loadReports = async () => {
    if (!user) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const [daily, weekly, monthly] = await Promise.all([
        reportsService.getDaily(today, user.id),
        reportsService.getWeekly(today, user.id),
        reportsService.getMonthly(new Date().getFullYear(), new Date().getMonth() + 1, user.id),
      ]);
      setDailyReport(daily);
      setWeeklyReport(weekly);
      setMonthlyReport(monthly);
    } catch (err) {
      console.error('Error loading reports:', err);
    }
  };

  const handleClockIn = async () => {
    setIsRecording(true);
    try {
      const location = await getLocation();
      const clockingData: Partial<Clocking> = {};
      const deviceInfo = navigator.userAgent;
      if (location) {
        clockingData.latitude = location.latitude;
        clockingData.longitude = location.longitude;
        clockingData.deviceInfo = `${deviceInfo} | Ubicación: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
      } else {
        clockingData.deviceInfo = deviceInfo;
      }
      await clockingService.recordEntry(clockingData);
      await loadTodayClockings();
      await loadReports();
      setLastStatus('ENTRY');
    } catch (err) {
      console.error('Error recording entry:', err);
    } finally {
      setIsRecording(false);
    }
  };

  const handleClockOut = async () => {
    setIsRecording(true);
    try {
      const location = await getLocation();
      const clockingData: Partial<Clocking> = {};
      const deviceInfo = navigator.userAgent;
      if (location) {
        clockingData.latitude = location.latitude;
        clockingData.longitude = location.longitude;
        clockingData.deviceInfo = `${deviceInfo} | Ubicación: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
      } else {
        clockingData.deviceInfo = deviceInfo;
      }
      await clockingService.recordExit(clockingData);
      await loadTodayClockings();
      await loadReports();
      setLastStatus('EXIT');
    } catch (err) {
      console.error('Error recording exit:', err);
    } finally {
      setIsRecording(false);
    }
  };

  const isWorking = lastStatus === 'ENTRY';

  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const calculateCurrentWorkTime = () => {
    if (!isWorking || todayClockings.length === 0) return null;
    const lastEntry = todayClockings.filter(c => c.type === 'ENTRY').pop();
    if (!lastEntry) return null;
    const diff = Date.now() - new Date(lastEntry.timestamp).getTime();
    const hours = diff / (1000 * 60 * 60);
    return formatHours(hours);
  };

  const currentWorkTime = calculateCurrentWorkTime();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Bienvenido, {user?.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {user?.role === 'ADMIN' ? 'Administrador' : 'Empleado'}
            </p>
          </div>

          <div className="border-t border-gray-200">
            <div className="px-4 py-12 sm:p-6 flex flex-col items-center">
              <div className="text-center mb-8">
                <div className={`text-6xl font-bold ${isWorking ? 'text-green-600' : 'text-gray-400'}`}>
                  {isWorking ? 'TRABAJANDO' : 'SIN TRABAJAR'}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {isWorking
                    ? currentWorkTime
                      ? `Tiempo actual: ${currentWorkTime}`
                      : 'Has registrado tu entrada'
                    : 'Registra tu entrada para comenzar'}
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleClockIn}
                  disabled={isWorking || isRecording}
                  className={`px-8 py-4 rounded-full text-xl font-bold text-white transition-all ${
                    isWorking || isRecording
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 hover:scale-105'
                  }`}
                >
                  {isRecording ? 'Registrando...' : 'ENTRADA'}
                </button>

                <button
                  onClick={handleClockOut}
                  disabled={!isWorking || isRecording}
                  className={`px-8 py-4 rounded-full text-xl font-bold text-white transition-all ${
                    !isWorking || isRecording
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 hover:scale-105'
                  }`}
                >
                  {isRecording ? 'Registrando...' : 'SALIDA'}
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-4 py-4 sm:p-6">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Fichajes de hoy</h4>
            <ul className="divide-y divide-gray-200">
              {todayClockings.map((clocking) => (
                <li key={clocking.id} className="py-3">
                  <div className="flex justify-between">
                    <span className={`font-medium ${clocking.type === 'ENTRY' ? 'text-green-600' : 'text-red-600'}`}>
                      {clocking.type === 'ENTRY' ? 'Entrada' : 'Salida'}
                    </span>
                    <span className="text-gray-500">
                      {new Date(clocking.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {clocking.latitude && clocking.longitude && (
                    <p className="text-xs text-gray-400 mt-1">
                      📍 {clocking.latitude.toFixed(4)}, {clocking.longitude.toFixed(4)}
                    </p>
                  )}
                </li>
              ))}
              {todayClockings.length === 0 && (
                <li className="py-3 text-gray-500 text-center">Sin fichajes hoy</li>
              )}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h4 className="text-sm font-medium text-gray-500 uppercase">Hoy</h4>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {dailyReport ? formatHours(dailyReport.totalHours) : '0h 0m'}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {dailyReport?.clockings.length || 0} registros
            </p>
          </div>

          <div className="bg-white shadow sm:rounded-lg p-6">
            <h4 className="text-sm font-medium text-gray-500 uppercase">Esta Semana</h4>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {weeklyReport ? formatHours(weeklyReport.totalHours) : '0h 0m'}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {Object.keys(weeklyReport?.dailySummary || {}).length} días Trabajados
            </p>
          </div>

          <div className="bg-white shadow sm:rounded-lg p-6">
            <h4 className="text-sm font-medium text-gray-500 uppercase">Este Mes</h4>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {monthlyReport ? formatHours(monthlyReport.totalHours) : '0h 0m'}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {Object.keys(monthlyReport?.dailySummary || {}).length} días Trabajados
            </p>
          </div>
        </div>

        {weeklyReport && Object.keys(weeklyReport.dailySummary).length > 0 && (
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Horas por día esta semana</h4>
            <div className="flex items-end space-x-2 h-48">
              {Object.entries(weeklyReport.dailySummary)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([date, hours]) => {
                  const maxHours = Math.max(...Object.values(weeklyReport.dailySummary));
                  const heightPercent = maxHours > 0 ? (hours / maxHours) * 100 : 0;
                  const dayName = new Date(date).toLocaleDateString('es-ES', { weekday: 'short' });
                  return (
                    <div key={date} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-primary-500 rounded-t"
                        style={{ height: `${heightPercent}%`, minHeight: hours > 0 ? '8px' : '0' }}
                      />
                      <p className="mt-2 text-xs text-gray-500">{dayName}</p>
                      <p className="text-xs font-medium text-gray-900">{formatHours(hours)}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};