import { IsEmail, Length, IsString } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  nickname: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 20)
  password: string;

  @IsString()
  role: UserRole;
}
