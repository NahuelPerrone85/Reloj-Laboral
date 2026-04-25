import axios from 'axios';
import type { AuthResponse, User, Company, Clocking, Project, Schedule, Vacation } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.access_token);
    return data;
  },

  register: async (userData: Partial<User> & { password: string }): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('token', data.access_token);
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/auth/profile');
    return data;
  },
};

export const companiesService = {
  getAll: async (): Promise<Company[]> => {
    const { data } = await api.get('/companies');
    return data;
  },

  getById: async (id: string): Promise<Company> => {
    const { data } = await api.get(`/companies/${id}`);
    return data;
  },

  create: async (company: Partial<Company>): Promise<Company> => {
    const { data } = await api.post('/companies', company);
    return data;
  },

  update: async (id: string, company: Partial<Company>): Promise<Company> => {
    const { data } = await api.patch(`/companies/${id}`, company);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/companies/${id}`);
  },
};

export const clockingService = {
  getAll: async (): Promise<Clocking[]> => {
    const { data } = await api.get('/clocking');
    return data;
  },

  getByUser: async (userId: string): Promise<Clocking[]> => {
    const { data } = await api.get(`/clocking/user/${userId}`);
    return data;
  },

  getToday: async (userId: string): Promise<Clocking[]> => {
    const { data } = await api.get(`/clocking/today/${userId}`);
    return data;
  },

  recordEntry: async (clocking: Partial<Clocking> = {}): Promise<Clocking> => {
    const { data } = await api.post('/clocking/entry', clocking);
    return data;
  },

  recordExit: async (clocking: Partial<Clocking> = {}): Promise<Clocking> => {
    const { data } = await api.post('/clocking/exit', clocking);
    return data;
  },
};

export const projectsService = {
  getAll: async (): Promise<Project[]> => {
    const { data } = await api.get('/projects');
    return data;
  },

  getById: async (id: string): Promise<Project> => {
    const { data } = await api.get(`/projects/${id}`);
    return data;
  },

  create: async (project: Partial<Project>): Promise<Project> => {
    const { data } = await api.post('/projects', project);
    return data;
  },

  update: async (id: string, project: Partial<Project>): Promise<Project> => {
    const { data } = await api.patch(`/projects/${id}`, project);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

export const schedulesService = {
  getAll: async (): Promise<Schedule[]> => {
    const { data } = await api.get('/schedules');
    return data;
  },

  getById: async (id: string): Promise<Schedule> => {
    const { data } = await api.get(`/schedules/${id}`);
    return data;
  },

  create: async (schedule: Partial<Schedule>): Promise<Schedule> => {
    const { data } = await api.post('/schedules', schedule);
    return data;
  },

  update: async (id: string, schedule: Partial<Schedule>): Promise<Schedule> => {
    const { data } = await api.patch(`/schedules/${id}`, schedule);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/schedules/${id}`);
  },
};

export interface DailyReport {
  date: string;
  clockings: Clocking[];
  totalHours: number;
}

export interface WeeklyReport {
  startDate: string;
  endDate: string;
  clockings: Clocking[];
  dailySummary: Record<string, number>;
  totalHours: number;
}

export interface MonthlyReport {
  year: number;
  month: number;
  clockings: Clocking[];
  dailySummary: Record<string, number>;
  totalHours: number;
}

export const reportsService = {
  getDaily: async (date?: string, userId?: string): Promise<DailyReport> => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (userId) params.append('userId', userId);
    const { data } = await api.get(`/reports/daily?${params}`);
    return data;
  },

  getWeekly: async (startDate?: string, userId?: string): Promise<WeeklyReport> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (userId) params.append('userId', userId);
    const { data } = await api.get(`/reports/weekly?${params}`);
    return data;
  },

  getMonthly: async (year: number, month: number, userId?: string): Promise<MonthlyReport> => {
    const params = new URLSearchParams();
    params.append('year', year.toString());
    params.append('month', month.toString());
    if (userId) params.append('userId', userId);
    const { data } = await api.get(`/reports/monthly?${params}`);
    return data;
  },
};

export const vacationsService = {
  getAll: async (): Promise<Vacation[]> => {
    const { data } = await api.get('/vacations');
    return data;
  },

  getMy: async (): Promise<Vacation[]> => {
    const { data } = await api.get('/vacations/my');
    return data;
  },

  getPending: async (): Promise<Vacation[]> => {
    const { data } = await api.get('/vacations/pending');
    return data;
  },

  create: async (vacation: Partial<Vacation>): Promise<Vacation> => {
    const { data } = await api.post('/vacations', vacation);
    return data;
  },

  update: async (id: string, vacation: Partial<Vacation>): Promise<Vacation> => {
    const { data } = await api.patch(`/vacations/${id}`, vacation);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/vacations/${id}`);
  },
};

export default api;