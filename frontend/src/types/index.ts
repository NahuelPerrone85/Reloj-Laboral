export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EMPLOYEE';
  companyId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Clocking {
  id: string;
  userId: string;
  type: 'ENTRY' | 'EXIT';
  timestamp: string;
  latitude?: number;
  longitude?: number;
  deviceInfo?: string;
  notes?: string;
  projectId?: string;
  user?: User;
  project?: Project;
}

export interface Project {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  color: string;
  active: boolean;
}

export interface Schedule {
  id: string;
  companyId: string;
  name: string;
  type: 'FLEXIBLE' | 'SEMIFLEXIBLE' | 'STRICT';
  startTime: string;
  endTime: string;
  flexStart?: string;
  flexEnd?: string;
  workingDays?: number[];
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export type VacationType = 'VACATION' | 'SICK_LEAVE' | 'PERSONAL' | 'OTHER';
export type VacationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface Vacation {
  id: string;
  userId: string;
  type: VacationType;
  startDate: string;
  endDate: string;
  status: VacationStatus;
  reason?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}