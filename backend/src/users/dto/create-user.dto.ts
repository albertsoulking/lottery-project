import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator'
import type { UserRole } from '../../entities/user.entity'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsIn(['Admin', 'User', 'Test'])
  role?: UserRole
}
