import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class DecodeTokenBodyDTO {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  token: string
}