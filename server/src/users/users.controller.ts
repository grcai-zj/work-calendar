import { Controller, Post, Get, Put, Body, Headers, HttpCode, HttpStatus 
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
} from '@nestjs/common';
import { UsersService 
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
} from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
}

  // 微信登录（使用 code）
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: { code: string; nickname?: string; avatarUrl?: string 
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
},
  ) {
    console.log('[Users] login request - code:', body.code);
    const user = await this.usersService.loginWithCode(
      body.code,
    );
    console.log('[Users] login result - user:', user ? { id: user.id, nickname: user.nickname 
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
} : null);
    
    if (!user) {
      return { code: 400, msg: '微信登录失败', data: null 
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
};
    
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
}
    
    // 更新用户信息（如果有）
    if (body.nickname || body.avatarUrl) {
      await this.usersService.update(user.id, {
        nickname: body.nickname || user.nickname,
        avatar_url: body.avatarUrl || user.avatar_url,
      
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
});
      // 重新获取更新后的用户信息
      const updatedUser = await this.usersService.findById(user.id);
      return { code: 200, msg: 'success', data: updatedUser 
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
};
    
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
}
    
    return { code: 200, msg: 'success', data: user 
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
};
  
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
}

  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string 
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
}) {
    const { phone 
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
} = body;

    if (!/^1[3-9]\d{9
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
}$/.test(phone)) {
      return { code: 400, msg: 'Invalid phone number', data: null 
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
};
    
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
}

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.usersService.createVerificationCode(phone, code);

    console.log(`[验证码] 手机号: ${phone
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
}, 验证码: ${code
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
}`);

    return {
      code: 200,
      msg: 'Verification code sent',
      data: { code 
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
},
    
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
};
  
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
}

  // 手机号登录
  @Post('login-by-phone')
  @HttpCode(HttpStatus.OK)
  async loginByPhone(
    @Body() body: { phone: string; code: string 
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
},
  ) {
    const { phone, code 
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
} = body;

    if (!/^1[3-9]\d{9
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
}$/.test(phone)) {
      return { code: 400, msg: 'Invalid phone number', data: null 
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
};
    
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
}

    const isValid = await this.usersService.verifyCode(phone, code);
    if (!isValid) {
      return { code: 400, msg: 'Invalid or expired verification code', data: null 
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
};
    
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
}

    const user = await this.usersService.findOrCreateByPhone(phone);

    return { code: 200, msg: 'success', data: user 
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
};
  
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
}

  @Get('me')
  async getMe(@Headers('x-user-id') userId: string) {
    if (!userId) {
      return { code: 401, msg: 'Unauthorized', data: null 
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
};
    
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
}

    const user = await this.usersService.findById(userId);
    if (!user) {
      return { code: 404, msg: 'User not found', data: null 
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
};
    
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
}

    return { code: 200, msg: 'success', data: user 
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
};
  
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
}

  @Put('update')
  @HttpCode(HttpStatus.OK)
  async update(
    @Headers('x-user-id') userId: string,
    @Body() body: { nickname?: string; avatarUrl?: string 
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
},
  ) {
    if (!userId) {
      return { code: 401, msg: 'Unauthorized', data: null 
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
};
    
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
}

    const user = await this.usersService.update(userId, {
      nickname: body.nickname,
      avatar_url: body.avatarUrl,
    
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
});

    return { code: 200, msg: 'success', data: user 
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
};
  
  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
}

  // 发送验证码
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    // 开发环境：直接返回成功，不实际发送短信
    // 生产环境：需要集成短信服务（如阿里云、腾讯云）
    console.log('[Users] send code to:', body.phone);
    return { code: 200, msg: '验证码已发送', data: null };
  }

  // 手机号登录
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(
    @Body() body: { phone: string; code: string },
  ) {
    console.log('[Users] phone login - phone:', body.phone, 'code:', body.code);
    
    // 开发环境：验证码固定为 123456
    // 生产环境：需要验证真实的验证码
    if (body.code !== '123456') {
      return { code: 400, msg: '验证码错误', data: null };
    }
    
    const user = await this.usersService.loginWithPhone(body.phone);
    if (!user) {
      return { code: 400, msg: '登录失败', data: null };
    }
    
    return { code: 200, msg: 'success', data: user };
  }
}
