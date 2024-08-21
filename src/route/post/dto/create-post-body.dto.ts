import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePostBodyDTO {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  authorId: string

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  image: string
}