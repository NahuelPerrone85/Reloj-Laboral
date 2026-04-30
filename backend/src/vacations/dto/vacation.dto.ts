import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVacationDto {
  @ApiProperty({ example: 'VACATION' })
  @IsEnum(['VACATION', 'SICK_LEAVE', 'PERSONAL', 'OTHER'])
  type: 'VACATION' | 'SICK_LEAVE' | 'PERSONAL' | 'OTHER';

  @ApiProperty({ example: '2026-07-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-07-15' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 'Vacaciones de verano', required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class UpdateVacationDto {
  @ApiProperty({ example: 'APPROVED', required: false })
  @IsEnum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'])
  @IsOptional()
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}
