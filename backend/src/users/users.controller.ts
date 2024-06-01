import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/strategies/access-token.strategy';
import { UserDto } from './dtos/user.dto';

@Controller('users')
@UseGuards(AccessTokenGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('current')
  async getCurrentUser(@Req() req: Request) {
    const payload = req.user as JwtPayload;

    const user = await this.usersService.findByLogin(payload.login);

    return new UserDto(user);
  }
}
