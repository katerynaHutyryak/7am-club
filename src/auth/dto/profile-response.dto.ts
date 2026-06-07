import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProfileResponseDto {
  @Expose()
  sub: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  constructor(sub: string, email: string, name: string) {
    this.sub = sub;
    this.email = email;
    this.name = name;
  }
}
