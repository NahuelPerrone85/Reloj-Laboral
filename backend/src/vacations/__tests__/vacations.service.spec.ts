import { Test, TestingModule } from '@nestjs/testing';
import { VacationsService } from '../vacations.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('VacationsService', () => {
  let vacationsService: VacationsService;
  let prismaService: any;

  const mockVacation = {
    id: 'vacation-uuid',
    userId: 'user-uuid',
    type: 'VACATION',
    startDate: new Date('2026-07-01'),
    endDate: new Date('2026-07-15'),
    status: 'PENDING',
    reason: 'Vacaciones de verano',
    approvedBy: null,
    approvedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: 'user-uuid',
      email: 'test@example.com',
      name: 'Test User',
      role: 'EMPLOYEE',
    },
  };

  beforeEach(async () => {
    prismaService = {
      vacation: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacationsService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    vacationsService = module.get<VacationsService>(VacationsService);
  });

  describe('create', () => {
    it('should create a vacation request', async () => {
      prismaService.vacation.create.mockResolvedValue(mockVacation);

      const result = await vacationsService.create(
        {
          type: 'VACATION',
          startDate: '2026-07-01',
          endDate: '2026-07-15',
          reason: 'Vacaciones de verano',
        },
        'user-uuid',
      );

      expect(result).toHaveProperty('id');
      expect(result.status).toBe('PENDING');
      expect(prismaService.vacation.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-uuid',
          type: 'VACATION',
          status: 'PENDING',
        }),
      });
    });

    it('should create sick leave request', async () => {
      const sickLeave = { ...mockVacation, type: 'SICK_LEAVE' };
      prismaService.vacation.create.mockResolvedValue(sickLeave);

      const result = await vacationsService.create(
        {
          type: 'SICK_LEAVE',
          startDate: '2026-07-01',
          endDate: '2026-07-05',
        },
        'user-uuid',
      );

      expect(result.type).toBe('SICK_LEAVE');
    });
  });

  describe('findAll', () => {
    it('should return all vacation requests', async () => {
      prismaService.vacation.findMany.mockResolvedValue([mockVacation]);

      const result = await vacationsService.findAll();

      expect(result).toHaveLength(1);
      expect(prismaService.vacation.findMany).toHaveBeenCalledWith({
        orderBy: { startDate: 'desc' },
        include: { user: true },
      });
    });
  });

  describe('findByUser', () => {
    it('should return vacations for a specific user', async () => {
      prismaService.vacation.findMany.mockResolvedValue([mockVacation]);

      const result = await vacationsService.findByUser('user-uuid');

      expect(result).toHaveLength(1);
      expect(prismaService.vacation.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-uuid' },
        orderBy: { startDate: 'desc' },
      });
    });
  });

  describe('findPending', () => {
    it('should return pending vacation requests', async () => {
      prismaService.vacation.findMany.mockResolvedValue([mockVacation]);

      const result = await vacationsService.findPending();

      expect(result).toHaveLength(1);
      expect(prismaService.vacation.findMany).toHaveBeenCalledWith({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'desc' },
        include: { user: true },
      });
    });
  });

  describe('update', () => {
    it('should approve a vacation request', async () => {
      const approved = { ...mockVacation, status: 'APPROVED', approvedBy: 'admin-uuid' };
      prismaService.vacation.update.mockResolvedValue(approved);

      const result = await vacationsService.update('vacation-uuid', { status: 'APPROVED' }, 'admin-uuid');

      expect(result.status).toBe('APPROVED');
      expect(prismaService.vacation.update).toHaveBeenCalledWith({
        where: { id: 'vacation-uuid' },
        data: expect.objectContaining({
          status: 'APPROVED',
          approvedBy: 'admin-uuid',
        }),
      });
    });

    it('should reject a vacation request', async () => {
      const rejected = { ...mockVacation, status: 'REJECTED' };
      prismaService.vacation.update.mockResolvedValue(rejected);

      const result = await vacationsService.update('vacation-uuid', { status: 'REJECTED' }, 'admin-uuid');

      expect(result.status).toBe('REJECTED');
    });
  });

  describe('remove', () => {
    it('should delete a vacation request', async () => {
      prismaService.vacation.delete.mockResolvedValue(mockVacation);

      const result = await vacationsService.remove('vacation-uuid');

      expect(prismaService.vacation.delete).toHaveBeenCalledWith({
        where: { id: 'vacation-uuid' },
      });
    });
  });
});