import { IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ScheduleType {
  FLEXIBLE = 'FLEXIBLE',
  SEMIFLEXIBLE = 'SEMIFLEXIBLE',
  STRICT = 'STRICT',
}

export class CreateScheduleDto {
  @ApiProperty({ example: 'Horario Mañana' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ enum: ScheduleType, example: ScheduleType.FLEXIBLE })
  @IsEnum(ScheduleType)
  type: ScheduleType;

  @ApiProperty({ example: '09:00' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '18:00' })
  @IsString()
  endTime: string;

  @ApiProperty({ example: 'uuid-de-empresa' })
  @IsString()
  companyId: string;

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
