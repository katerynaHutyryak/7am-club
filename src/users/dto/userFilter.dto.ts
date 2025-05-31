import { IsOptional, IsString } from 'class-validator';

export class UserFilterDTO {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  nickname?: string;
}
