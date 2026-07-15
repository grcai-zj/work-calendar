import { Controller, Post, Get, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: { openid: string; nickname?: string; avatarUrl?: string },
  ) {
    const user = await this.usersService.findOrCreateByOpenid(
      body.openid,
      body.nickname,
      body.avatarUrl,
    );
    return { code: 200, msg: 'success', data: user };
  }

  @Get('me')
  async getMe(@Headers('x-user-id') userId: string) {
    if (!userId) {
      return { code: 401, msg: 'Unauthorized', data: null };
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
      return { code: 404, msg: 'User not found', data: null };
    }

    return { code: 200, msg: 'success', data: user };
  }

  @Post('update')
  @HttpCode(HttpStatus.OK)
  async update(
    @Headers('x-user-id') userId: string,
    @Body() body: { nickname?: string; avatarUrl?: string },
  ) {
    if (!userId) {
      return { code: 401, msg: 'Unauthorized', data: null };
    }

    const user = await this.usersService.update(userId, {
      nickname: body.nickname,
      avatar_url: body.avatarUrl,
    });

    if (!user) {
      return { code: 404, msg: 'User not found', data: null };
    }

    return { code: 200, msg: 'success', data: user };
  }
}
