import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { TokenBlocklistService } from './token-blocklist.service';
import { RevokedToken } from './revoked-token.entity';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([RevokedToken]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' }, // must match TOKEN_EXPIRY_SECONDS in auth.constants.ts
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, RolesGuard, TokenBlocklistService],
  exports: [AuthGuard, RolesGuard, TokenBlocklistService],
})
export class AuthModule {}
