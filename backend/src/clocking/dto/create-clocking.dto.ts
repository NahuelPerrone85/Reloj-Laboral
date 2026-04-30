import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClockingDto {
  @ApiProperty({ example: 40.7128 })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ example: -74.006 })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ example: 'Chrome on Windows' })
  @IsString()
  @IsOptional()
  deviceInfo?: string;

  @ApiProperty({ example: 'uuid-de-proyecto' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiProperty({ example: 'Notas opcionales' })
  @IsString()
  @IsOptional()
  notes?: string;
}
