import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { TokenBlocklistService } from './token-blocklist.service';
import { TOKEN_EXPIRY_SECONDS } from './auth.constants';

interface RawTokenPayload {
  jti: string;
  exp?: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokenBlocklist: TokenBlocklistService,
  ) {}

  async signUp(dto: SignUpDto): Promise<string> {
    const existing = await this.usersService.find({ email: dto.email });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create(
      dto.email,
      passwordHash,
      dto.name,
    );

    return this.jwtService.signAsync(this.buildTokenPayload(user));
  }

  async signIn(dto: SignInDto): Promise<string> {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await this.verifyPassword(
      dto.password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.jwtService.signAsync(this.buildTokenPayload(user));
  }

  async signOut(rawToken: string): Promise<void> {
    try {
      const payload = await this.jwtService.verifyAsync<RawTokenPayload>(
        rawToken,
        { ignoreExpiration: true },
      );
      const expiresAt = payload.exp
        ? new Date(payload.exp * 1000)
        : new Date(Date.now() + TOKEN_EXPIRY_SECONDS * 1000);
      await this.tokenBlocklist.revoke(payload.jti, expiresAt);
    } catch {
      // Invalid signature — cookie is still cleared by the controller
    }
  }

  private buildTokenPayload(user: { id: string; role: string }) {
    return { sub: user.id, role: user.role, jti: randomUUID() };
  }

  private verifyPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
