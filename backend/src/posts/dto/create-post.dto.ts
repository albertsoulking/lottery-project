import { IsEnum, IsInt, IsNotEmpty, IsString, Min, ValidateIf } from 'class-validator'

export class CreatePostDto {
  @IsInt()
  issue: number

  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  summary: string

  @IsString()
  @ValidateIf((o) => o.type === 'PAID')
  contentHidden: string

  @IsEnum(['FREE', 'PAID'])
  type: 'FREE' | 'PAID'

  @IsInt()
  @Min(0)
  price: number

  @IsInt()
  publisherId: number
}
