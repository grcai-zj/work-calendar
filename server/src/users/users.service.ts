import { Injectable 
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
} from '@nestjs/common';
import { getSupabaseClient 
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
} from '@/storage/database/supabase-client';
import { User 
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
} from './user.entity';

@Injectable()
export class UsersService {
  private get client() {
    return getSupabaseClient();
  
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}

  // 微信登录：使用 code 换取 openid
  async loginWithCode(code: string): Promise<User | null> {
    // 调用微信 code2Session 接口
    // 注意：实际生产环境需要配置 AppID 和 AppSecret
    // 这里简化处理，开发环境使用设备标识符
    // 生产环境需要替换为真实的微信 API 调用
    
    const appId = process.env.WECHAT_APP_ID;
    const appSecret = process.env.WECHAT_APP_SECRET;
    
    // 开发环境：使用传入的 code（实际是 deviceId）作为 openid
    // 这样同一设备每次登录都使用同一个用户
    let openid = code;
    
    if (appId && appSecret) {
      try {
        // 生产环境：调用微信 API 换取 openid
        const response = await fetch(
          `https://api.weixin.qq.com/sns/jscode2session?appid=${appId
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}&secret=${appSecret
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}&js_code=${code
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}&grant_type=authorization_code`
        );
        const data = await response.json();
        if (data.openid) {
          openid = data.openid;
        
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
} else {
          console.error('[微信登录] code2Session 失败:', data);
          return null;
        
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}
      
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
} catch (error) {
        console.error('[微信登录] 调用微信 API 失败:', error);
        return null;
      
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}
    
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}
    
    return this.findOrCreateByOpenid(openid);
  
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}

  async findByOpenid(openid: string): Promise<User | null> {
    const { data, error 
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
} = await this.client
      .from('users')
      .select('*')
      .eq('openid', openid)
      .single();

    if (error || !data) {
      return null;
    
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}

    return data as User;
  
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}

  async findByPhone(phone: string): Promise<User | null> {
    const { data, error 
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
} = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error || !data) {
      return null;
    
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}

    return data as User;
  
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}

  async findById(id: string): Promise<User | null> {
    const { data, error 
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
} = await this.client
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}

    return data as User;
  
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}

  async create(openid: string, nickname?: string, avatarUrl?: string): Promise<User> {
    const id = this.generateId();
    const now = new Date().toISOString();

    const { data, error 
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
} = await this.client
      .from('users')
      .insert({
        id,
        openid,
        nickname,
        avatar_url: avatarUrl,
        created_at: now,
        updated_at: now,
      
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
})
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}`);
    
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}

    return data as User;
  
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}

  async createByPhone(phone: string, nickname?: string): Promise<User> {
    const id = this.generateId();
    const now = new Date().toISOString();

    const { data, error 
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
} = await this.client
      .from('users')
      .insert({
        id,
        phone,
        nickname,
        created_at: now,
        updated_at: now,
      
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
})
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}`);
    
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}

    return data as User;
  
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}

  async findOrCreateByOpenid(openid: string, nickname?: string, avatarUrl?: string): Promise<User> {
    const existingUser = await this.findByOpenid(openid);
    if (existingUser) {
      return existingUser;
    
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}
    return this.create(openid, nickname, avatarUrl);
  
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}

  async findOrCreateByPhone(phone: string): Promise<User> {
    const existingUser = await this.findByPhone(phone);
    if (existingUser) {
      return existingUser;
    
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}
    return this.createByPhone(phone);
  
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}

  async update(id: string, data: Partial<User>): Promise<User> {
    const { data: updatedUser, error 
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
} = await this.client
      .from('users')
      .update({ ...data, updated_at: new Date().toISOString() 
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
})
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user: ${error.message
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}`);
    
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}

    return updatedUser as User;
  
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
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
      
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
});
  
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}

  async verifyCode(phone: string, code: string): Promise<boolean> {
    const { data, error 
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
} = await this.client
      .from('verification_codes')
      .select('*')
      .eq('phone', phone)
      .eq('code', code)
      .eq('used', false)
      .order('created_at', { ascending: false 
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
})
      .limit(1)
      .single();

    if (error || !data) {
      return false;
    
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}

    if (new Date(data.expires_at) < new Date()) {
      return false;
    
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}

    await this.client
      .from('verification_codes')
      .update({ used: true 
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
})
      .eq('id', data.id);

    return true;
  
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}

  private generateId(): string {
    return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  
  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}

  // 手机号登录
  async loginWithPhone(phone: string): Promise<User | null> {
    // 查找用户
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      // 用户不存在，创建新用户
      const { data: newUser, error: createError } = await this.client
        .from('users')
        .insert({
          phone,
          nickname: '用户',
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return null;
      }
      return newUser;
    }

    return data;
  }
}
