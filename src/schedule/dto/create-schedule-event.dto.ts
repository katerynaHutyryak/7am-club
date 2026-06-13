import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateScheduleEventDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @IsDateString()
  start: string;

  @IsDateString()
  end: string;

  @IsBoolean()
  allDay: boolean;

  @IsString()
  @MaxLength(20)
  color: string;
}
