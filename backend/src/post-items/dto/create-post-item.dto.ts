import { IsInt, IsNotEmpty, IsObject, IsOptional, Min, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class ResultPayload {
  @IsInt()
  @Min(0)
  number: number

  @IsOptional()
  @IsNotEmpty()
  zodiac?: string
}

export class CreatePostItemDto {
  @IsInt()
  @Min(1)
  postId: number

  @IsInt()
  @Min(1)
  typeId: number

  @IsObject()
  @IsNotEmpty()
  prediction: Record<string, unknown>

  @ValidateNested()
  @Type(() => ResultPayload)
  result: ResultPayload

  @IsOptional()
  @IsObject()
  extra?: Record<string, unknown>
}
