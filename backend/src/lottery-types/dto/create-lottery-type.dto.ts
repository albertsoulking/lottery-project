import { IsEnum, IsNotEmpty, IsObject, IsString } from 'class-validator'

export class CreateLotteryTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  code: string

  @IsEnum(['number', 'zodiac', 'tail', 'combo'])
  ruleType: 'number' | 'zodiac' | 'tail' | 'combo'

  @IsObject()
  config: Record<string, unknown>
}
