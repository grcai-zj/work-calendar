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

  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
