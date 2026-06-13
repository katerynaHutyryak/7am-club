import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CookieOptions, Response } from 'express';
import { AuthService } from './auth.service';
import type { JwtPayload } from './auth.guard';
import { Public } from './public.decorator';
import {
  ACCESS_TOKEN_COOKIE,
  AUTH_RATE_LIMIT_MAX,
  AUTH_RATE_LIMIT_TTL,
  TOKEN_EXPIRY_SECONDS,
} from './auth.constants';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';

function getCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: TOKEN_EXPIRY_SECONDS * 1000,
  };
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Throttle({
    global: { ttl: AUTH_RATE_LIMIT_TTL, limit: AUTH_RATE_LIMIT_MAX },
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('signup')
  async signUp(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const token = await this.authService.signUp(dto);
    res.cookie(ACCESS_TOKEN_COOKIE, token, getCookieOptions());
  }

  @Public()
  @Throttle({
    global: { ttl: AUTH_RATE_LIMIT_TTL, limit: AUTH_RATE_LIMIT_MAX },
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('signin')
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const token = await this.authService.signIn(dto);
    res.cookie(ACCESS_TOKEN_COOKIE, token, getCookieOptions());
  }

  @Public()
  @Post('signout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async signOut(
    @Request() req: { cookies?: Record<string, string> },
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const token = req.cookies?.[ACCESS_TOKEN_COOKIE];
    if (token) {
      await this.authService.signOut(token);
    }
    res.clearCookie(ACCESS_TOKEN_COOKIE, getCookieOptions());
  }

  @Get('profile')
  getProfile(@Request() req: { user: JwtPayload }): ProfileResponseDto {
    const { sub, email, name } = req.user;
    return new ProfileResponseDto(sub, email, name);
  }
}
