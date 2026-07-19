import { Controller, Post, Get, Put, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 微信登录（使用 code）
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: { code: string; nickname?: string; avatarUrl?: string },
  ) {
    const user = await this.usersService.loginWithCode(
      body.code,
    );
    
    if (!user) {
      return { code: 400, msg: '微信登录失败', data: null };
    }
    
    // 更新用户信息（如果有）
    if (body.nickname || body.avatarUrl) {
      await this.usersService.update(user.id, {
        nickname: body.nickname || user.nickname,
        avatar_url: body.avatarUrl || user.avatar_url,
      });
    }
    
    return { code: 200, msg: 'success', data: user };
  }

  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    const { phone } = body;

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return { code: 400, msg: 'Invalid phone number', data: null };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.usersService.createVerificationCode(phone, code);

    console.log(`[验证码] 手机号: ${phone}, 验证码: ${code}`);

    return {
      code: 200,
      msg: 'Verification code sent',
      data: { code },
    };
  }

  // 手机号登录
  @Post('login-by-phone')
  @HttpCode(HttpStatus.OK)
  async loginByPhone(
    @Body() body: { phone: string; code: string },
  ) {
    const { phone, code } = body;

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return { code: 400, msg: 'Invalid phone number', data: null };
    }

    const isValid = await this.usersService.verifyCode(phone, code);
    if (!isValid) {
      return { code: 400, msg: 'Invalid or expired verification code', data: null };
    }

    const user = await this.usersService.findOrCreateByPhone(phone);

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

  @Put('update')
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

    return { code: 200, msg: 'success', data: user };
  }
}
