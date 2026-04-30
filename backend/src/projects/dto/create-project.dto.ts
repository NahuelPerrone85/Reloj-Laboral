import { IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'Proyecto Alpha' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'Descripción del proyecto' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '#3B82F6' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ example: 'uuid-de-empresa', required: false })
  @IsString()
  @IsOptional()
  companyId?: string;
}
