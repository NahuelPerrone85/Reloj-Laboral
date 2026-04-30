import { IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto {
  @ApiProperty({ example: 'Proyecto Alpha Actualizado' })
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Nueva descripción' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '#10B981' })
  @IsString()
  @IsOptional()
  color?: string;
}
