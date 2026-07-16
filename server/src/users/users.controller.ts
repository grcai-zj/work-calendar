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

  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    const { phone } = body;

    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return { code: 400, msg: 'Invalid phone number', data: null };
    }

    // 生成6位随机验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 保存验证码到数据库
    await this.usersService.createVerificationCode(phone, code);

    // 注意：实际生产环境需要接入短信服务商发送验证码
    // 这里只是将验证码保存到数据库，开发环境可以直接返回验证码
    console.log(`[验证码] 手机号: ${phone}, 验证码: ${code}`);

    return { code: 200, msg: 'Verification code sent', data: { code } };
  }

  // 手机号登录
  @Post('login-by-phone')
  @HttpCode(HttpStatus.OK)
  async loginByPhone(
    @Body() body: { phone: string; code: string },
  ) {
    const { phone, code } = body;

    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return { code: 400, msg: 'Invalid phone number', data: null };
    }

    // 验证验证码
    const isValid = await this.usersService.verifyCode(phone, code);
    if (!isValid) {
      return { code: 400, msg: 'Invalid or expired verification code', data: null };
    }

    // 查找或创建用户
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
