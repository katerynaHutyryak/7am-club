import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { RevokedToken } from './revoked-token.entity';

@Injectable()
export class TokenBlocklistService implements OnModuleInit, OnModuleDestroy {
  private cleanupTimer: NodeJS.Timeout;

  constructor(
    @InjectRepository(RevokedToken)
    private readonly repo: Repository<RevokedToken>,
  ) {}

  onModuleInit() {
    this.cleanupTimer = setInterval(
      () => {
        void this.cleanup();
      },
      60 * 60 * 1000,
    );
  }

  onModuleDestroy() {
    clearInterval(this.cleanupTimer);
  }

  async revoke(jti: string, expiresAt: Date): Promise<void> {
    await this.repo.save({ jti, expiresAt });
  }

  async isRevoked(jti: string): Promise<boolean> {
    const entry = await this.repo.findOne({ where: { jti } });
    return !!entry && entry.expiresAt > new Date();
  }

  private async cleanup(): Promise<void> {
    await this.repo.delete({ expiresAt: LessThan(new Date()) });
  }
}
