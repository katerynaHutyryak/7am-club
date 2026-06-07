import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuthResponseDto {
  @Expose()
  access_token: string;

  constructor(accessToken: string) {
    this.access_token = accessToken;
  }
}
