import { Exclude, Expose } from 'class-transformer';
import { Reflection } from '../reflection.type';

@Exclude()
export class ReflectionResponseDto {
  @Expose()
  id: string;

  @Expose()
  periodStart: string;

  @Expose()
  periodEnd: string;

  @Expose()
  wentWell: string;

  @Expose()
  couldImprove: string;

  @Expose()
  actionItems: string;

  @Expose()
  ideas: string;

  @Expose()
  userId: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt?: Date;

  constructor(reflection: Reflection) {
    Object.assign(this, reflection);
  }
}
