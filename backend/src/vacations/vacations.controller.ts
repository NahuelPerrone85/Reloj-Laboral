import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { VacationsService } from './vacations.service';
import { CreateVacationDto, UpdateVacationDto } from './dto/vacation.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('vacations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vacations')
export class VacationsController {
  constructor(private readonly vacationsService: VacationsService) {}

  @Post()
  @ApiOperation({ summary: 'Solicitar vacaciones/ausencia' })
  create(@Body() createVacationDto: CreateVacationDto, @Request() req: any) {
    return this.vacationsService.create(createVacationDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las solicitudes' })
  findAll() {
    return this.vacationsService.findAll();
  }

  @Get('my')
  @ApiOperation({ summary: 'Mis solicitudes' })
  findMy(@Request() req: any) {
    return this.vacationsService.findByUser(req.user.id);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Solicitudes pendientes (admin)' })
  findPending() {
    return this.vacationsService.findPending();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener solicitud por ID' })
  findOne(@Param('id') id: string) {
    return this.vacationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar solicitud (aprobar/rechazar)' })
  update(
    @Param('id') id: string,
    @Body() updateVacationDto: UpdateVacationDto,
    @Request() req: any
  ) {
    return this.vacationsService.update(id, updateVacationDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar solicitud' })
  remove(@Param('id') id: string) {
    return this.vacationsService.remove(id);
  }
}
