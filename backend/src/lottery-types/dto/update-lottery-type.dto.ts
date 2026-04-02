import { IsEnum, IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, IsString } from 'class-validator'

export class UpdateLotteryTypeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  code?: string

  @IsOptional()
  @IsEnum(['number', 'zodiac', 'tail', 'combo'])
  ruleType?: 'number' | 'zodiac' | 'tail' | 'combo'

  @IsOptional()
  @IsObject()
  @IsNotEmptyObject()
  config?: Record<string, unknown>
}
