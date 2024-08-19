import { Type } from "class-transformer"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateLikeBodyDTO {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  userId: string
  
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  postId: string
}