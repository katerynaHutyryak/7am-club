import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CreateGoalStepDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsDateString()
  deadline: string;
}

export class CreateGoalDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(2000)
  motivation: string;

  @IsDateString()
  deadline: string;

  @IsArray()
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  categories: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGoalStepDto)
  steps: CreateGoalStepDto[];
}
