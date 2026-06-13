import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Visibility } from '../enums/visibility.enum';

export class CreateBubbleDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(500)
  topic: string;

  @IsOptional()
  @IsNumber()
  colorIndex?: number;

  @IsEnum(Visibility)
  visibility: Visibility;

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  @MaxLength(254, { each: true })
  invitedEmails?: string[];
}
