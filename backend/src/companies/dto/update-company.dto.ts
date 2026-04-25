import { IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCompanyDto {
  @ApiProperty({ example: 'Mi Empresa Actualizada S.L.' })
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;
}