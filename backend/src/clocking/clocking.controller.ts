import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ClockingService } from './clocking.service';
import { CreateClockingDto } from './dto/create-clocking.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('clocking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('clocking')
export class ClockingController {
  constructor(private readonly clockingService: ClockingService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los fichajes' })
  findAll() {
    return this.clockingService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener fichajes de un usuario' })
  findByUser(@Param('userId') userId: string) {
    return this.clockingService.findByUser(userId);
  }

  @Get('today/:userId')
  @ApiOperation({ summary: 'Obtener fichajes de hoy' })
  findTodayByUser(@Param('userId') userId: string) {
    return this.clockingService.findTodayByUser(userId);
  }

  @Post('entry')
  @ApiOperation({ summary: 'Registrar entrada' })
  recordEntry(@Body() createClockingDto: CreateClockingDto, @Request() req: any) {
    return this.clockingService.recordEntry(createClockingDto, req.user.id);
  }

  @Post('exit')
  @ApiOperation({ summary: 'Registrar salida' })
  recordExit(@Body() createClockingDto: CreateClockingDto, @Request() req: any) {
    return this.clockingService.recordExit(createClockingDto, req.user.id);
  }
}