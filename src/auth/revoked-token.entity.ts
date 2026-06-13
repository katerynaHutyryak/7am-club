import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('revoked_tokens')
export class RevokedToken {
  @PrimaryColumn()
  jti: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;
}
