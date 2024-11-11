import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be a least 6 charter long' })
  password: string;
}
