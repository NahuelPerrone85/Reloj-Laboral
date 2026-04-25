import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDailyReport(date: string, userId: string) {
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const clockings = await this.prisma.clocking.findMany({
      where: {
        userId,
        timestamp: {
          gte: targetDate,
          lt: nextDay,
        },
      },
      orderBy: { timestamp: 'asc' },
      include: { project: true },
    });

    let totalHours = 0;
    let entryTime: Date | null = null;

    for (const clocking of clockings) {
      if (clocking.type === 'ENTRY') {
        entryTime = clocking.timestamp;
      } else if (clocking.type === 'EXIT' && entryTime) {
        const diff = clocking.timestamp.getTime() - entryTime.getTime();
        totalHours += diff / (1000 * 60 * 60);
        entryTime = null;
      }
    }

    return { date: targetDate.toISOString(), clockings, totalHours };
  }

  async getWeeklyReport(startDate: string, userId: string) {
    const start = startDate ? new Date(startDate) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    const clockings = await this.prisma.clocking.findMany({
      where: {
        userId,
        timestamp: {
          gte: start,
          lt: end,
        },
      },
      orderBy: { timestamp: 'asc' },
      include: { project: true },
    });

    let totalHours = 0;
    let entryTime: Date | null = null;
    const dailySummary: Record<string, number> = {};

    for (const clocking of clockings) {
      const dateKey = clocking.timestamp.toISOString().split('T')[0];
      if (clocking.type === 'ENTRY') {
        entryTime = clocking.timestamp;
      } else if (clocking.type === 'EXIT' && entryTime) {
        const diff = clocking.timestamp.getTime() - entryTime.getTime();
        const hours = diff / (1000 * 60 * 60);
        dailySummary[dateKey] = (dailySummary[dateKey] || 0) + hours;
        totalHours += hours;
        entryTime = null;
      }
    }

    return { startDate: start.toISOString(), endDate: end.toISOString(), clockings, dailySummary, totalHours };
  }

  async getMonthlyReport(year: number, month: number, userId: string) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const clockings = await this.prisma.clocking.findMany({
      where: {
        userId,
        timestamp: {
          gte: start,
          lt: end,
        },
      },
      orderBy: { timestamp: 'asc' },
      include: { project: true },
    });

    let totalHours = 0;
    let entryTime: Date | null = null;
    const dailySummary: Record<string, number> = {};

    for (const clocking of clockings) {
      const dateKey = clocking.timestamp.toISOString().split('T')[0];
      if (clocking.type === 'ENTRY') {
        entryTime = clocking.timestamp;
      } else if (clocking.type === 'EXIT' && entryTime) {
        const diff = clocking.timestamp.getTime() - entryTime.getTime();
        const hours = diff / (1000 * 60 * 60);
        dailySummary[dateKey] = (dailySummary[dateKey] || 0) + hours;
        totalHours += hours;
        entryTime = null;
      }
    }

    return { year, month, clockings, dailySummary, totalHours };
  }
}