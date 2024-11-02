import { Type } from "class-transformer"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateMessageBodyDTO {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  userId: string

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  chatId: string

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  message: string
}