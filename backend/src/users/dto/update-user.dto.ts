import { IsString, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../auth/dto/register.dto';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe Actualizado' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'newemail@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ example: 'uuid-de-empresa' })
  @IsString()
  @IsOptional()
  companyId?: string;
}
