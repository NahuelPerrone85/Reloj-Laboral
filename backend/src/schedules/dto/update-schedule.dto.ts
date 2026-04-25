import { IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ScheduleType } from './create-schedule.dto';

export class UpdateScheduleDto {
  @ApiProperty({ example: 'Horario Mañana Actualizado' })
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;

  @ApiProperty({ enum: ScheduleType })
  @IsEnum(ScheduleType)
  @IsOptional()
  type?: ScheduleType;

  @ApiProperty({ example: '09:30' })
  @IsString()
  @IsOptional()
  startTime?: string;

  @ApiProperty({ example: '18:30' })
  @IsString()
  @IsOptional()
  endTime?: string;

  @ApiProperty({ example: '08:00' })
  @IsString()
  @IsOptional()
  flexStart?: string;

  @ApiProperty({ example: '10:00' })
  @IsString()
  @IsOptional()
  flexEnd?: string;

  @ApiProperty({ example: [1, 2, 3, 4, 5] })
  @IsOptional()
  workingDays?: number[];
}