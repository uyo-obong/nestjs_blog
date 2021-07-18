import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDTO {
  @IsEmail()
  @IsString()
  @MinLength(4)
  email: string;

  @MinLength(4)
  @IsString()
  password: string;
}

export class RegisterDTO extends LoginDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(25)
  username: string;
}

export interface AuthPayload {
  id: string;
  email: string;
}
