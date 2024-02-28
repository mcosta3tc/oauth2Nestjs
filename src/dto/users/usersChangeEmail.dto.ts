import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export abstract class UsersChangeEmailDto {
  @IsString()
  @MinLength(1)
  password!: string;

  @IsString()
  @IsEmail()
  @Length(5, 255)
  email: string;
}
