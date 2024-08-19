import { Type } from "class-transformer"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateCommentBodyDTO {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  userId: string

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  postId: string

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  message: string
}