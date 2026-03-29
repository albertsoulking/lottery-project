import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator'

export class AdjustBalanceDto {
  @IsInt()
  userId: number

  @IsInt()
  @Min(-1000000)
  amount: number

  @IsString()
  @IsOptional()
  remark?: string
}
