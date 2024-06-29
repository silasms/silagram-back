import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class AuthenticationBodyDTO {
  @IsEmail()
  @IsNotEmpty()
  @Type(() => String)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  @Type(() => String)
  password: string;
}