import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { Role } from '../users/role.enum';
import { IS_PUBLIC_KEY } from './public.decorator';
import { TokenBlocklistService } from './token-blocklist.service';
import { UsersService } from '../users/users.service';
import { ACCESS_TOKEN_COOKIE } from './auth.constants';

type RawJwtPayload = Omit<JwtPayload, 'email' | 'name'>;

export interface JwtPayload {
  sub: string;
  role: Role;
  jti: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private tokenBlocklist: TokenBlocklistService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();

    const token = (request.cookies as Record<string, string> | undefined)?.[
      ACCESS_TOKEN_COOKIE
    ];
    if (!token) {
      throw new UnauthorizedException();
    }

    let payload: RawJwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<RawJwtPayload>(token);
    } catch {
      throw new UnauthorizedException();
    }

    if (!payload.jti) {
      throw new UnauthorizedException();
    }

    const [isRevoked, user] = await Promise.all([
      this.tokenBlocklist.isRevoked(payload.jti),
      this.usersService.find({ id: payload.sub }),
    ]);

    if (isRevoked || !user) {
      throw new UnauthorizedException();
    }

    request.user = {
      sub: user.id,
      role: user.role,
      jti: payload.jti,
      email: user.email,
      name: user.name,
      iat: payload.iat,
      exp: payload.exp,
    };

    return true;
  }
}
