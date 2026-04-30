import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClockingDto } from './dto/create-clocking.dto';
import { SchedulesService } from '../schedules/schedules.service';

export enum ClockingType {
  ENTRY = 'ENTRY',
  EXIT = 'EXIT',
}

@Injectable()
export class ClockingService {
  constructor(
    private prisma: PrismaService,
    private schedulesService: SchedulesService
  ) {}

  async findAll() {
    return this.prisma.clocking.findMany({
      orderBy: { timestamp: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.clocking.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      include: { project: true },
    });
  }

  async findTodayByUser(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.prisma.clocking.findMany({
      where: {
        userId,
        timestamp: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: { timestamp: 'asc' },
    });
  }

  async recordEntry(createClockingDto: CreateClockingDto, userId: string) {
    const validation = await this.schedulesService.validateClockingTime(
      userId,
      'ENTRY',
      new Date()
    );

    const clocking = await this.prisma.clocking.create({
      data: {
        userId,
        type: ClockingType.ENTRY,
        timestamp: new Date(),
        latitude: createClockingDto.latitude,
        longitude: createClockingDto.longitude,
        deviceInfo: createClockingDto.deviceInfo,
        projectId: createClockingDto.projectId,
        notes: validation.message,
      },
    });

    return { ...clocking, validation };
  }

  async recordExit(createClockingDto: CreateClockingDto, userId: string) {
    const validation = await this.schedulesService.validateClockingTime(userId, 'EXIT', new Date());

    const clocking = await this.prisma.clocking.create({
      data: {
        userId,
        type: ClockingType.EXIT,
        timestamp: new Date(),
        latitude: createClockingDto.latitude,
        longitude: createClockingDto.longitude,
        deviceInfo: createClockingDto.deviceInfo,
        projectId: createClockingDto.projectId,
        notes: validation.message,
      },
    });

    return { ...clocking, validation };
  }
}
