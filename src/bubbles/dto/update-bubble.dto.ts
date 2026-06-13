import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Visibility } from '../enums/visibility.enum';

export class UpdateBubbleDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  topic?: string;

  @IsOptional()
  @IsNumber()
  colorIndex?: number;

  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility;
}
