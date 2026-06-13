import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateReflectionDto {
  @IsOptional()
  @IsDateString()
  periodStart?: string;

  @IsOptional()
  @IsDateString()
  periodEnd?: string;

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
