import { IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  login: string;

  @IsString()
  name: string;

  @IsString()
  @MinLength(8)
  password: string;
}
