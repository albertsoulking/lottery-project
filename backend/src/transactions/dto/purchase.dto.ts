import { IsInt } from 'class-validator'

export class PurchaseDto {
  @IsInt()
  postId: number
}
