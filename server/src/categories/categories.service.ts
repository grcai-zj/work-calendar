import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export interface Category {
  id: string;
  parent_id: string | null;
  name: string;
  type: string;
  level: number;
  sort_order: number;
  created_at: string;
}

@Injectable()
export class CategoriesService {
  private get client() {
    return getSupabaseClient();
  }

  // 获取分类列表（支持按类型和层级筛选）
  async findAll(type?: string, level?: number): Promise<Category[]> {
    let query = this.client.from('categories').select('id, parent_id, name, type, level, sort_order, created_at');
    if (type) {
      query = query.eq('type', type);
    }
    if (level) {
      query = query.eq('level', level);
    }
    const { data, error } = await query.order('sort_order').order('created_at');
    if (error) throw new Error(`查询分类失败: ${error.message}`);
    return data as Category[];
  }

  // 获取大类及其小类（树形结构）
  async findTree(type: string): Promise<any[]> {
    const { data: parents, error: parentError } = await this.client
      .from('categories')
      .select('id, parent_id, name, type, level, sort_order, created_at')
      .eq('type', type)
      .eq('level', 1)
      .order('sort_order')
      .order('created_at');
    if (parentError) throw new Error(`查询大类失败: ${parentError.message}`);

    const { data: children, error: childError } = await this.client
      .from('categories')
      .select('id, parent_id, name, type, level, sort_order, created_at')
      .eq('type', type)
      .eq('level', 2)
      .order('sort_order')
      .order('created_at');
    if (childError) throw new Error(`查询小类失败: ${childError.message}`);

    const result = (parents || []).map((parent) => ({
      ...parent,
      children: (children || []).filter((c) => c.parent_id === parent.id),
    }));
    return result;
  }

  // 创建分类
  async create(body: { name: string; type: string; parent_id?: string; level?: number; sort_order?: number }): Promise<Category> {
    const insertData: any = {
      name: body.name,
      type: body.type,
      level: body.parent_id ? 2 : (body.level || 1),
      sort_order: body.sort_order || 0,
    };
    if (body.parent_id) {
      insertData.parent_id = body.parent_id;
    }
    const { data, error } = await this.client
      .from('categories')
      .insert(insertData)
      .select('id, parent_id, name, type, level, sort_order, created_at')
      .single();
    if (error) throw new Error(`创建分类失败: ${error.message}`);
    return data as Category;
  }

  // 删除分类
  async remove(id: string): Promise<void> {
    // 先删除子分类
    const { error: childError } = await this.client.from('categories').delete().eq('parent_id', id);
    if (childError) throw new Error(`删除子分类失败: ${childError.message}`);
    const { error } = await this.client.from('categories').delete().eq('id', id);
    if (error) throw new Error(`删除分类失败: ${error.message}`);
  }

  // 更新分类
  async update(id: string, body: { name?: string; sort_order?: number }): Promise<Category> {
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.sort_order !== undefined) updateData.sort_order = body.sort_order;
    const { data, error } = await this.client
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select('id, parent_id, name, type, level, sort_order, created_at')
      .single();
    if (error) throw new Error(`更新分类失败: ${error.message}`);
    return data as Category;
  }
}
