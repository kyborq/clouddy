import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { SetCookiesInterceptor } from 'src/common/interceptors/set-cookies.interceptor';
import { ClearCookiesInterceptor } from 'src/common/interceptors/clear-cookies.interceptor';

import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(SetCookiesInterceptor)
  async login(@Body() credentials: LoginDto) {
    return await this.authService.login(credentials);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(SetCookiesInterceptor)
  async register(@Body() credentials: RegisterDto) {
    return await this.authService.register(credentials);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(ClearCookiesInterceptor)
  async logout(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.authService.logout(userId);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @UseInterceptors(SetCookiesInterceptor)
  async refresh(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return await this.authService.refreshTokens(userId, refreshToken);
  }
}
