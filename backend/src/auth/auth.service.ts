import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
  private readonly jwtAccessSecret: string;
  private readonly jwtRefreshSecret: string;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.jwtAccessSecret = configService.get('JWT_ACCESS_SECRET');
    this.jwtRefreshSecret = configService.get('JWT_REFRESH_SECRET');
  }

  async register(credentials: RegisterDto) {
    const hashedPassword = await this.hashData(credentials.password);

    const createdUser = await this.usersService.createUser({
      ...credentials,
      password: hashedPassword,
    });

    return this.issueTokens(createdUser.id, createdUser.login);
  }

  async login(credentials: LoginDto) {
    const user = await this.usersService.findByLogin(credentials.login);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const passwordsMatching = await argon2.verify(
      user.password,
      credentials.password,
    );
    if (!passwordsMatching) {
      throw new BadRequestException('Password or login are incorrect');
    }

    return this.issueTokens(user.id, user.login);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.getValidUserForRefreshToken(userId);

    await this.verifyRefreshToken(user.token, refreshToken);

    return this.issueTokens(user.id, user.login);
  }

  async logout(id: string) {
    await this.usersService.setRefreshToken(id);
  }

  private async verifyRefreshToken(storedToken: string, providedToken: string) {
    const refreshTokenMatches = await argon2.verify(storedToken, providedToken);
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }
  }

  private async getValidUserForRefreshToken(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.token) {
      throw new ForbiddenException('Access Denied');
    }
    return user;
  }

  private async issueTokens(userId: string, login: string) {
    const tokens = await this.generateTokens(userId, login);
    await this.updateRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  private async generateTokens(userId: string, login: string) {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, login },
      { secret: this.jwtAccessSecret, expiresIn: '15m' },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, login },
      { secret: this.jwtRefreshSecret, expiresIn: '7d' },
    );

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.setRefreshToken(userId, hashedRefreshToken);
  }

  private async hashData(data: string): Promise<string> {
    return argon2.hash(data);
  }
}
