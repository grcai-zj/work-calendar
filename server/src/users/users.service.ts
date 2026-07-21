import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private get client() {
    return getSupabaseClient();
  }

  // 微信登录：使用 code 换取 openid
  async loginWithCode(code: string, nickname?: string, avatarUrl?: string): Promise<User | null> {
    // 调用微信 code2Session 接口
    // 注意：实际生产环境需要配置 AppID 和 AppSecret
    // 这里简化处理，开发环境使用固定标识符
    // 生产环境需要替换为真实的微信 API 调用
    
    const appId = process.env.WECHAT_APP_ID;
    const appSecret = process.env.WECHAT_APP_SECRET;
    
    // 开发环境：使用固定的测试用户标识，避免每次登录创建新用户
    // 生产环境会通过微信 API 获取真实的 openid
    let openid = 'dev_test_user';
    
    if (appId && appSecret) {
      try {
        // 生产环境：调用微信 API 换取 openid
        const response = await fetch(
          `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`
        );
        const data = await response.json();
        if (data.openid) {
          openid = data.openid;
        } else {
          console.error('[微信登录] code2Session 失败:', data);
          return null;
        }
      } catch (error) {
        console.error('[微信登录] 调用微信 API 失败:', error);
        return null;
      }
    }
    
    return this.findOrCreateByOpenid(openid, nickname, avatarUrl);
  }

  async findByOpenid(openid: string): Promise<User | null> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('openid', openid)
      .single();

    if (error || !data) {
      return null;
    }

    return data as User;
  }

  async findByPhone(phone: string): Promise<User | null> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error || !data) {
      return null;
    }

    return data as User;
  }

  async findById(id: string): Promise<User | null> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return data as User;
  }

  async create(openid: string, nickname?: string, avatarUrl?: string): Promise<User> {
    const id = this.generateId();
    const now = new Date().toISOString();

    const { data, error } = await this.client
      .from('users')
      .insert({
        id,
        openid,
        nickname: nickname || '用户',
        avatar_url: avatarUrl,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return data as User;
  }

  async createByPhone(phone: string, nickname?: string): Promise<User> {
    const id = this.generateId();
    const now = new Date().toISOString();

    const { data, error } = await this.client
      .from('users')
      .insert({
        id,
        phone,
        nickname: nickname || '用户',
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return data as User;
  }

  async findOrCreateByOpenid(openid: string, nickname?: string, avatarUrl?: string): Promise<User> {
    const existingUser = await this.findByOpenid(openid);
    if (existingUser) {
      // 更新用户信息（如果有新数据）
      if (nickname || avatarUrl) {
        await this.update(existingUser.id, {
          nickname: nickname || existingUser.nickname,
          avatar_url: avatarUrl || existingUser.avatar_url,
        });
        const updatedUser = await this.findById(existingUser.id);
        if (updatedUser) return updatedUser;
      }
      return existingUser;
    }
    return this.create(openid, nickname, avatarUrl);
  }

  async findOrCreateByPhone(phone: string): Promise<User> {
    const existingUser = await this.findByPhone(phone);
    if (existingUser) {
      return existingUser;
    }
    return this.createByPhone(phone);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const { data: updatedUser, error } = await this.client
      .from('users')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return updatedUser as User;
  }

  async createVerificationCode(phone: string, code: string): Promise<void> {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    await this.client
      .from('verification_codes')
      .insert({
        phone,
        code,
        expires_at: expiresAt,
        used: false,
      });
  }

  async verifyCode(phone: string, code: string): Promise<boolean> {
    const { data, error } = await this.client
      .from('verification_codes')
      .select('*')
      .eq('phone', phone)
      .eq('code', code)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return false;
    }

    if (new Date(data.expires_at) < new Date()) {
      return false;
    }

    await this.client
      .from('verification_codes')
      .update({ used: true })
      .eq('id', data.id);

    return true;
  }

  private generateId(): string {
    return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }
}
