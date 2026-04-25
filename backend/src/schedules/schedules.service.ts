import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

export interface ValidationResult {
  valid: boolean;
  type: 'EARLY' | 'ON_TIME' | 'LATE' | 'OUTSIDE' | 'NO_SCHEDULE';
  message: string;
  details?: {
    expectedStart?: string;
    expectedEnd?: string;
    actualTime?: string;
    minutesDifference?: number;
  };
}

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async create(createScheduleDto: CreateScheduleDto) {
    return this.prisma.schedule.create({ data: createScheduleDto });
  }

  async findAll() {
    return this.prisma.schedule.findMany();
  }

  async findOne(id: string) {
    const schedule = await this.prisma.schedule.findUnique({ where: { id } });
    if (!schedule) {
      throw new NotFoundException('Horario no encontrado');
    }
    return schedule;
  }

  async findByCompany(companyId: string) {
    return this.prisma.schedule.findMany({
      where: { companyId },
    });
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    await this.findOne(id);
    return this.prisma.schedule.update({
      where: { id },
      data: updateScheduleDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.schedule.delete({ where: { id } });
  }

  async validateClockingTime(
    userId: string,
    clockingType: 'ENTRY' | 'EXIT',
    timestamp: Date,
  ): Promise<ValidationResult> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!user?.companyId) {
      return {
        valid: true,
        type: 'NO_SCHEDULE',
        message: 'Usuario sin empresa asignada, no se valida horario',
      };
    }

    const schedules = await this.findByCompany(user.companyId);
    if (schedules.length === 0) {
      return {
        valid: true,
        type: 'NO_SCHEDULE',
        message: 'Empresa sin horarios configurados',
      };
    }

    const schedule = schedules[0];
    const clockingHour = timestamp.getHours();
    const clockingMinutes = timestamp.getMinutes();
    const clockingTimeMinutes = clockingHour * 60 + clockingMinutes;

    const [startHour, startMin] = schedule.startTime.split(':').map(Number);
    const [endHour, endMin] = schedule.endTime.split(':').map(Number);
    const startTimeMinutes = startHour * 60 + startMin;
    const endTimeMinutes = endHour * 60 + endMin;

    const entryGraceMinutes = 30;
    const exitGraceMinutes = 30;

    if (clockingType === 'ENTRY') {
      const earlyLimitMinutes = startTimeMinutes - entryGraceMinutes;
      const lateLimitMinutes = startTimeMinutes + entryGraceMinutes;

      if (clockingTimeMinutes < earlyLimitMinutes) {
        return {
          valid: true,
          type: 'EARLY',
          message: `Entrada muy temprana. Horario: ${schedule.startTime}`,
          details: {
            expectedStart: schedule.startTime,
            actualTime: `${String(clockingHour).padStart(2, '0')}:${String(clockingMinutes).padStart(2, '0')}`,
          },
        };
      }

      if (clockingTimeMinutes <= startTimeMinutes) {
        return {
          valid: true,
          type: 'ON_TIME',
          message: 'Entrada a tiempo',
          details: {
            expectedStart: schedule.startTime,
            actualTime: `${String(clockingHour).padStart(2, '0')}:${String(clockingMinutes).padStart(2, '0')}`,
            minutesDifference: startTimeMinutes - clockingTimeMinutes,
          },
        };
      }

      if (clockingTimeMinutes <= lateLimitMinutes) {
        return {
          valid: true,
          type: 'LATE',
          message: 'Entrada tardía',
          details: {
            expectedStart: schedule.startTime,
            actualTime: `${String(clockingHour).padStart(2, '0')}:${String(clockingMinutes).padStart(2, '0')}`,
            minutesDifference: clockingTimeMinutes - startTimeMinutes,
          },
        };
      }

      return {
        valid: false,
        type: 'OUTSIDE',
        message: `Entrada fuera de horario permitido (desde ${schedule.startTime})`,
        details: {
          expectedStart: schedule.startTime,
          actualTime: `${String(clockingHour).padStart(2, '0')}:${String(clockingMinutes).padStart(2, '0')}`,
        },
      };
    }

    const earlyExitMinutes = endTimeMinutes - exitGraceMinutes;
    const lateExitMinutes = endTimeMinutes + exitGraceMinutes;

    if (clockingTimeMinutes < earlyExitMinutes) {
      return {
        valid: false,
        type: 'OUTSIDE',
        message: `Salida muy temprana. Horario: ${schedule.endTime}`,
        details: {
          expectedEnd: schedule.endTime,
          actualTime: `${String(clockingHour).padStart(2, '0')}:${String(clockingMinutes).padStart(2, '0')}`,
        },
      };
    }

    if (clockingTimeMinutes <= endTimeMinutes) {
      return {
        valid: true,
        type: 'ON_TIME',
        message: 'Salida a tiempo',
        details: {
          expectedEnd: schedule.endTime,
          actualTime: `${String(clockingHour).padStart(2, '0')}:${String(clockingMinutes).padStart(2, '0')}`,
          minutesDifference: clockingTimeMinutes - endTimeMinutes,
        },
      };
    }

    return {
      valid: true,
      type: 'ON_TIME',
      message: 'Salida después del horario',
      details: {
        expectedEnd: schedule.endTime,
        actualTime: `${String(clockingHour).padStart(2, '0')}:${String(clockingMinutes).padStart(2, '0')}`,
        minutesDifference: clockingTimeMinutes - endTimeMinutes,
      },
    };
  }
}