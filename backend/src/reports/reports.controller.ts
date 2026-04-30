import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('daily')
  @ApiOperation({ summary: 'Obtener reporte diario' })
  getDailyReport(@Query('date') date: string, @Query('userId') userId: string) {
    return this.reportsService.getDailyReport(date, userId);
  }

  @Get('weekly')
  @ApiOperation({ summary: 'Obtener reporte semanal' })
  getWeeklyReport(@Query('startDate') startDate: string, @Query('userId') userId: string) {
    return this.reportsService.getWeeklyReport(startDate, userId);
  }

  @Get('monthly')
  @ApiOperation({ summary: 'Obtener reporte mensual' })
  getMonthlyReport(
    @Query('year') year: number,
    @Query('month') month: number,
    @Query('userId') userId: string
  ) {
    return this.reportsService.getMonthlyReport(year, month, userId);
  }
}
