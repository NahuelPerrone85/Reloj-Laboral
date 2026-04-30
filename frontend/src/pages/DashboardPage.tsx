import { useState, useEffect, useCallback } from 'react';
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

  const loadTodayClockings = useCallback(async () => {
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
  }, [user]);

  const loadReports = useCallback(async () => {
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
  }, [user]);

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
  }, [user, loadTodayClockings, loadReports]);

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hola, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-gray-500 mt-1">
            {isWorking ? 'Estás trabajando actualmente' : '¿Listo para empezar el día?'}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-full">
          <span className={`w-2 h-2 rounded-full ${isWorking ? 'bg-success-500 animate-pulse' : 'bg-gray-400'}`}></span>
          <span className="text-sm font-medium text-primary-700">
            {isWorking ? 'En jornada' : 'Sin jornada'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Hoy</p>
              <p className="text-2xl font-bold text-gray-900">
                {dailyReport ? formatHours(dailyReport.totalHours) : '0h 0m'}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {dailyReport?.clockings.length || 0} registros hoy
            </p>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-info-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-info-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Esta Semana</p>
              <p className="text-2xl font-bold text-gray-900">
                {weeklyReport ? formatHours(weeklyReport.totalHours) : '0h 0m'}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {Object.keys(weeklyReport?.dailySummary || {}).length} días trabajados
            </p>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Este Mes</p>
              <p className="text-2xl font-bold text-gray-900">
                {monthlyReport ? formatHours(monthlyReport.totalHours) : '0h 0m'}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {Object.keys(monthlyReport?.dailySummary || {}).length} días trabajados
            </p>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col items-center">
            <div className={`text-5xl font-bold ${isWorking ? 'text-success-600' : 'text-gray-300'}`}>
              {isWorking ? 'TRABAJANDO' : 'SIN TRABAJAR'}
            </div>
            <p className="mt-3 text-gray-500">
              {isWorking
                ? currentWorkTime
                  ? `Tiempo actual: ${currentWorkTime}`
                  : 'Has registrado tu entrada'
                : 'Registra tu entrada para comenzar'}
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handleClockIn}
              disabled={isWorking || isRecording}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-bold text-white transition-all duration-200 transform hover:scale-105 ${
                isWorking || isRecording
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-success-500 hover:bg-success-600 shadow-lg hover:shadow-success-500/30'
              }`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {isRecording ? 'Registrando...' : 'ENTRADA'}
            </button>

            <button
              onClick={handleClockOut}
              disabled={!isWorking || isRecording}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-bold text-white transition-all duration-200 transform hover:scale-105 ${
                !isWorking || isRecording
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-danger-500 hover:bg-danger-600 shadow-lg hover:shadow-danger-500/30'
              }`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              {isRecording ? 'Registrando...' : 'SALIDA'}
            </button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Fichajes de hoy</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {todayClockings.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500">Sin fichajes hoy</p>
            </div>
          ) : (
            todayClockings.map((clocking) => (
              <div key={clocking.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    clocking.type === 'ENTRY' ? 'bg-success-100' : 'bg-danger-100'
                  }`}>
                    {clocking.type === 'ENTRY' ? (
                      <svg className="w-5 h-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-danger-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${clocking.type === 'ENTRY' ? 'text-success-700' : 'text-danger-700'}`}>
                      {clocking.type === 'ENTRY' ? 'Entrada' : 'Salida'}
                    </p>
                    {clocking.latitude && clocking.longitude && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        📍 {clocking.latitude.toFixed(4)}, {clocking.longitude.toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-500">
                  {new Date(clocking.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {weeklyReport && Object.keys(weeklyReport.dailySummary).length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Horas por día esta semana</h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {Object.entries(weeklyReport.dailySummary)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([date, hours]) => {
                const maxHours = Math.max(...Object.values(weeklyReport.dailySummary));
                const heightPercent = maxHours > 0 ? (hours / maxHours) * 100 : 0;
                const dayName = new Date(date).toLocaleDateString('es-ES', { weekday: 'short' });
                const isToday = new Date(date).toDateString() === new Date().toDateString();
                return (
                  <div key={date} className="flex-1 flex flex-col items-center">
                    <div className="w-full relative h-40 flex items-end">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${isToday ? 'bg-primary-500' : 'bg-primary-300'}`}
                        style={{ height: `${heightPercent}%`, minHeight: hours > 0 ? '8px' : '0' }}
                      />
                    </div>
                    <p className={`mt-3 text-sm font-medium ${isToday ? 'text-primary-600' : 'text-gray-500'}`}>
                      {dayName}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{formatHours(hours)}</p>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};