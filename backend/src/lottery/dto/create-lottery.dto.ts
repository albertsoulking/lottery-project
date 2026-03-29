import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CreateLotteryDto {
  @IsString()
  @IsNotEmpty()
  phase: string

  @IsString()
  @IsNotEmpty()
  numbers: string

  @IsEnum(['DRAWN', 'PENDING'])
  status: 'DRAWN' | 'PENDING'
}
