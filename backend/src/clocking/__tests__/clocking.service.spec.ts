import { Test, TestingModule } from '@nestjs/testing';
import { ClockingService, ClockingType } from '../clocking.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SchedulesService } from '../../schedules/schedules.service';

describe('ClockingService', () => {
  let clockingService: ClockingService;
  let prismaService: any;
  let schedulesService: any;

  const mockClocking = {
    id: 'clocking-uuid',
    userId: 'user-uuid',
    type: ClockingType.ENTRY,
    timestamp: new Date(),
    latitude: null,
    longitude: null,
    deviceInfo: null,
    notes: null,
    projectId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockValidation = {
    valid: true,
    type: 'ON_TIME',
    message: 'Entrada a tiempo',
  };

  beforeEach(async () => {
    prismaService = {
      clocking: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    schedulesService = {
      validateClockingTime: jest.fn().mockResolvedValue(mockValidation),
      findByCompany: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClockingService,
        { provide: PrismaService, useValue: prismaService },
        { provide: SchedulesService, useValue: schedulesService },
      ],
    }).compile();

    clockingService = module.get<ClockingService>(ClockingService);
  });

  describe('findAll', () => {
    it('should return all clockings', async () => {
      prismaService.clocking.findMany.mockResolvedValue([mockClocking]);

      const result = await clockingService.findAll();

      expect(result).toHaveLength(1);
      expect(prismaService.clocking.findMany).toHaveBeenCalledWith({
        orderBy: { timestamp: 'desc' },
        include: { user: { select: { id: true, name: true, email: true } } },
      });
    });
  });

  describe('findByUser', () => {
    it('should return clockings for a specific user', async () => {
      prismaService.clocking.findMany.mockResolvedValue([mockClocking]);

      const result = await clockingService.findByUser('user-uuid');

      expect(result).toHaveLength(1);
      expect(prismaService.clocking.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-uuid' },
        orderBy: { timestamp: 'desc' },
        include: { project: true },
      });
    });
  });

  describe('findTodayByUser', () => {
    it('should return today clockings for a user', async () => {
      prismaService.clocking.findMany.mockResolvedValue([mockClocking]);

      const result = await clockingService.findTodayByUser('user-uuid');

      expect(result).toHaveLength(1);
      expect(prismaService.clocking.findMany).toHaveBeenCalled();
    });
  });

  describe('recordEntry', () => {
    it('should create an entry clocking with validation', async () => {
      prismaService.clocking.create.mockResolvedValue(mockClocking);

      const result = await clockingService.recordEntry({}, 'user-uuid');

      expect(result.type).toBe(ClockingType.ENTRY);
      expect(result.validation).toBeDefined();
      expect(schedulesService.validateClockingTime).toHaveBeenCalledWith(
        'user-uuid',
        'ENTRY',
        expect.any(Date)
      );
    });

    it('should record entry with geolocation', async () => {
      const geoClocking = { ...mockClocking, latitude: 40.7128, longitude: -74.006 };
      prismaService.clocking.create.mockResolvedValue(geoClocking);

      const result = await clockingService.recordEntry(
        { latitude: 40.7128, longitude: -74.006 },
        'user-uuid'
      );

      expect(result.latitude).toBe(40.7128);
      expect(result.longitude).toBe(-74.006);
    });
  });

  describe('recordExit', () => {
    it('should create an exit clocking with validation', async () => {
      const exitClocking = { ...mockClocking, type: ClockingType.EXIT };
      prismaService.clocking.create.mockResolvedValue(exitClocking);

      const result = await clockingService.recordExit({}, 'user-uuid');

      expect(result.type).toBe(ClockingType.EXIT);
      expect(result.validation).toBeDefined();
      expect(schedulesService.validateClockingTime).toHaveBeenCalledWith(
        'user-uuid',
        'EXIT',
        expect.any(Date)
      );
    });
  });
});
