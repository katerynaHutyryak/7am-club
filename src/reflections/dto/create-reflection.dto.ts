import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateReflectionDto {
  @IsDateString()
  periodStart: string;

  @IsDateString()
  periodEnd: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  wentWell?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  couldImprove?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  actionItems?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  ideas?: string;
}
