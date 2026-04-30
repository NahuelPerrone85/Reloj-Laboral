import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVacationDto, UpdateVacationDto } from './dto/vacation.dto';

@Injectable()
export class VacationsService {
  constructor(private prisma: PrismaService) {}

  async create(createVacationDto: CreateVacationDto, userId: string) {
    return this.prisma.vacation.create({
      data: {
        userId,
        type: createVacationDto.type,
        startDate: new Date(createVacationDto.startDate),
        endDate: new Date(createVacationDto.endDate),
        reason: createVacationDto.reason,
        status: 'PENDING',
      },
    });
  }

  async findAll() {
    return this.prisma.vacation.findMany({
      orderBy: { startDate: 'desc' },
      include: { user: true },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.vacation.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
  }

  async findPending() {
    return this.prisma.vacation.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.vacation.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async update(id: string, updateVacationDto: UpdateVacationDto, approvedBy: string) {
    const data: any = { ...updateVacationDto };
    if (updateVacationDto.status === 'APPROVED') {
      data.approvedBy = approvedBy;
      data.approvedAt = new Date();
    }
    return this.prisma.vacation.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.vacation.delete({ where: { id } });
  }
}
