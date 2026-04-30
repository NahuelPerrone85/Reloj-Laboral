import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesService } from '../schedules.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('SchedulesService', () => {
  let schedulesService: SchedulesService;
  let prismaService: any;

  const mockSchedule = {
    id: 'schedule-uuid',
    companyId: 'company-uuid',
    name: 'Horario Regular',
    type: 'STRICT',
    startTime: '09:00',
    endTime: '17:00',
    flexStart: null,
    flexEnd: null,
    workingDays: [1, 2, 3, 4, 5],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser = {
    id: 'user-uuid',
    email: 'test@example.com',
    name: 'Test User',
    role: 'EMPLOYEE',
    companyId: 'company-uuid',
  };

  beforeEach(async () => {
    prismaService = {
      schedule: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [SchedulesService, { provide: PrismaService, useValue: prismaService }],
    }).compile();

    schedulesService = module.get<SchedulesService>(SchedulesService);
  });

  describe('validateClockingTime', () => {
    it('should validate early entry (before schedule start)', async () => {
      prismaService.user.findUnique.mockResolvedValue({ ...mockUser, company: {} });
      prismaService.schedule.findMany.mockResolvedValue([mockSchedule]);

      const earlyTime = new Date();
      earlyTime.setHours(7, 0, 0, 0);

      const result = await schedulesService.validateClockingTime('user-uuid', 'ENTRY', earlyTime);

      expect(result.valid).toBe(true);
      expect(result.type).toBe('EARLY');
    });

    it('should validate on-time entry', async () => {
      prismaService.user.findUnique.mockResolvedValue({ ...mockUser, company: {} });
      prismaService.schedule.findMany.mockResolvedValue([mockSchedule]);

      const onTime = new Date();
      onTime.setHours(8, 45, 0, 0);

      const result = await schedulesService.validateClockingTime('user-uuid', 'ENTRY', onTime);

      expect(result.valid).toBe(true);
      expect(result.type).toBe('ON_TIME');
    });

    it('should validate late entry (after schedule start)', async () => {
      prismaService.user.findUnique.mockResolvedValue({ ...mockUser, company: {} });
      prismaService.schedule.findMany.mockResolvedValue([mockSchedule]);

      const lateTime = new Date();
      lateTime.setHours(9, 30, 0, 0);

      const result = await schedulesService.validateClockingTime('user-uuid', 'ENTRY', lateTime);

      expect(result.valid).toBe(true);
      expect(result.type).toBe('LATE');
    });

    it('should reject entry too late', async () => {
      prismaService.user.findUnique.mockResolvedValue({ ...mockUser, company: {} });
      prismaService.schedule.findMany.mockResolvedValue([mockSchedule]);

      const tooLateTime = new Date();
      tooLateTime.setHours(11, 0, 0, 0);

      const result = await schedulesService.validateClockingTime('user-uuid', 'ENTRY', tooLateTime);

      expect(result.valid).toBe(false);
      expect(result.type).toBe('OUTSIDE');
    });

    it('should validate on-time exit', async () => {
      prismaService.user.findUnique.mockResolvedValue({ ...mockUser, company: {} });
      prismaService.schedule.findMany.mockResolvedValue([mockSchedule]);

      const exitTime = new Date();
      exitTime.setHours(17, 15, 0, 0);

      const result = await schedulesService.validateClockingTime('user-uuid', 'EXIT', exitTime);

      expect(result.valid).toBe(true);
    });

    it('should reject early exit', async () => {
      prismaService.user.findUnique.mockResolvedValue({ ...mockUser, company: {} });
      prismaService.schedule.findMany.mockResolvedValue([mockSchedule]);

      const earlyExit = new Date();
      earlyExit.setHours(14, 0, 0, 0);

      const result = await schedulesService.validateClockingTime('user-uuid', 'EXIT', earlyExit);

      expect(result.valid).toBe(false);
      expect(result.type).toBe('OUTSIDE');
    });

    it('should return NO_SCHEDULE for user without company', async () => {
      prismaService.user.findUnique.mockResolvedValue({ ...mockUser, companyId: null });

      const result = await schedulesService.validateClockingTime('user-uuid', 'ENTRY', new Date());

      expect(result.type).toBe('NO_SCHEDULE');
    });
  });
});
