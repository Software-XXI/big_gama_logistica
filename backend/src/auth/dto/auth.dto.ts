import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password debe contener al menos una mayúscula, una minúscula y un número',
  })
  password: string;

  @IsString()
  name: string;

  @IsString()
  role: 'ADMIN' | 'OPERATOR' | 'CONDUCTOR';
}

export class AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}