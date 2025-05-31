import {
  IsEmail,
  Length,
  Matches,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(8, 20)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, {
    message: 'Password must include upper/lowercase and a number',
  })
  password?: string;
}
