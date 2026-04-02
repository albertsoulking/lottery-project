import { IsInt, IsNotEmpty, IsObject, IsString } from 'class-validator'

export class CreatePredictionDto {
  @IsString()
  @IsNotEmpty()
  lotteryType: string

  @IsObject()
  data: Record<string, unknown>

  @IsInt()
  publisherId: number
}
