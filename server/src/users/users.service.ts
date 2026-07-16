import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private get client() {
    return getSupabaseClient();
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
        nickname,
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
        nickname: nickname || `用户${phone.slice(-4)}`,
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

  async update(id: string, updates: { nickname?: string; avatar_url?: string }): Promise<User | null> {
    const { data, error } = await this.client
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return null;
    }

    return data as User;
  }

  async findOrCreateByOpenid(openid: string, nickname?: string, avatarUrl?: string): Promise<User> {
    const existingUser = await this.findByOpenid(openid);
    if (existingUser) {
      return existingUser;
    }
    return this.create(openid, nickname, avatarUrl);
  }

  async findOrCreateByPhone(phone: string, nickname?: string): Promise<User> {
    const existingUser = await this.findByPhone(phone);
    if (existingUser) {
      return existingUser;
    }
    return this.createByPhone(phone, nickname);
  }

  // 验证码相关
  async createVerificationCode(phone: string, code: string): Promise<void> {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5分钟过期

    const { error } = await this.client
      .from('verification_codes')
      .insert({
        phone,
        code,
        expires_at: expiresAt,
      });

    if (error) {
      throw new Error(`Failed to create verification code: ${error.message}`);
    }
  }

  async verifyCode(phone: string, code: string): Promise<boolean> {
    const { data, error } = await this.client
      .from('verification_codes')
      .select('*')
      .eq('phone', phone)
      .eq('code', code)
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return false;
    }

    // 标记验证码已使用
    await this.client
      .from('verification_codes')
      .update({ used: true })
      .eq('id', data.id);

    return true;
  }

  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
