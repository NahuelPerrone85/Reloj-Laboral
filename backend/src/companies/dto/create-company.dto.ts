import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Mi Empresa S.L.' })
  @IsString()
  @MinLength(2)
  name: string;
}