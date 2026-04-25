import { Module, Global } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SchedulesModule } from '../schedules/schedules.module';
import { ClockingController } from './clocking.controller';
import { ClockingService } from './clocking.service';

@Global()
@Module({
  imports: [PrismaModule, SchedulesModule],
  controllers: [ClockingController],
  providers: [ClockingService],
  exports: [ClockingService],
})
export class ClockingModule {}