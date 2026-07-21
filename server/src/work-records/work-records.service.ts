import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export interface WorkRecord {
  id: string;
  category_id: string;
  sub_category_id: string | null;
  content: string;
  hours: number;
  record_date: string;
  user_id?: string;
  created_at: string;
  updated_at: string | null;
  category_name?: string;
  sub_category_name?: string;
}

@Injectable()
export class WorkRecordsService {
  private get client() {
    return getSupabaseClient();
  }

  // 按日期查询工作内容
  async findByDate(recordDate: string, userId?: string): Promise<WorkRecord[]> {
    console.log('[WorkRecords] findByDate - date:', recordDate, 'userId:', userId);
    let query = this.client
      .from('work_records')
      .select('id, category_id, sub_category_id, content, hours, record_date, user_id, created_at, updated_at')
      .eq('record_date', recordDate)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    console.log('[WorkRecords] query result - data count:', data?.length, 'error:', error?.message);
    if (error) throw new Error(`查询工作内容失败: ${error.message}`);

    // 批量获取分类名称
    const records = data as WorkRecord[];
    if (records.length === 0) return [];

    const categoryIds = [...new Set(records.flatMap(r => [r.category_id, r.sub_category_id].filter(Boolean)))];
    if (categoryIds.length > 0) {
      const { data: categories, error: catError } = await this.client
        .from('categories')
        .select('id, name')
        .in('id', categoryIds);
      if (catError) throw new Error(`查询分类失败: ${catError.message}`);

      const catMap = new Map((categories || []).map(c => [c.id, c.name]));
      records.forEach(r => {
        r.category_name = catMap.get(r.category_id) || '';
        r.sub_category_name = r.sub_category_id ? (catMap.get(r.sub_category_id) || '') : '';
      });
    }
    return records;
  }

  // 按日期范围查询（日历标记用）
  async findByDateRange(startDate: string, endDate: string, userId?: string): Promise<WorkRecord[]> {
    let query = this.client
      .from('work_records')
      .select('id, category_id, sub_category_id, content, hours, record_date, user_id, created_at, updated_at')
      .gte('record_date', startDate)
      .lte('record_date', endDate)
      .order('record_date', { ascending: true })
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw new Error(`查询工作内容失败：${error.message}`);

    const records = data as WorkRecord[];
    if (records.length === 0) return [];

    // 批量获取分类名称
    const categoryIds = [...new Set(records.flatMap(r => [r.category_id, r.sub_category_id].filter(Boolean)))];
    if (categoryIds.length > 0) {
      const { data: categories, error: catError } = await this.client
        .from('categories')
        .select('id, name')
        .in('id', categoryIds);
      if (catError) throw new Error(`查询分类失败：${catError.message}`);

      const catMap = new Map((categories || []).map(c => [c.id, c.name]));
      records.forEach(r => {
        r.category_name = catMap.get(r.category_id) || '';
        r.sub_category_name = r.sub_category_id ? (catMap.get(r.sub_category_id) || '') : '';
      });
    }

    return records;
  }

  // 创建工作内容
  async create(body: { category_id: string; sub_category_id?: string; content: string; hours?: number; record_date: string; user_id?: string }): Promise<WorkRecord> {
    const insertData: any = {
      category_id: body.category_id,
      content: body.content,
      hours: body.hours || 0,
      record_date: body.record_date,
    };
    if (body.sub_category_id) {
      insertData.sub_category_id = body.sub_category_id;
    }
    if (body.user_id) {
      insertData.user_id = body.user_id;
    }
    const { data, error } = await this.client
      .from('work_records')
      .insert(insertData)
      .select('id, category_id, sub_category_id, content, hours, record_date, user_id, created_at, updated_at')
      .single();
    if (error) throw new Error(`创建工作内容失败: ${error.message}`);
    return data as WorkRecord;
  }

  // 更新工作内容
  async update(id: string, body: { category_id?: string; sub_category_id?: string; content?: string; hours?: number; record_date?: string }): Promise<WorkRecord> {
    const updateData: any = {};
    if (body.category_id !== undefined) updateData.category_id = body.category_id;
    if (body.sub_category_id !== undefined) updateData.sub_category_id = body.sub_category_id;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.hours !== undefined) updateData.hours = body.hours;
    if (body.record_date !== undefined) updateData.record_date = body.record_date;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await this.client
      .from('work_records')
      .update(updateData)
      .eq('id', id)
      .select('id, category_id, sub_category_id, content, hours, record_date, user_id, created_at, updated_at')
      .single();
    if (error) throw new Error(`更新工作内容失败: ${error.message}`);
    return data as WorkRecord;
  }

  // 删除工作内容
  async remove(id: string): Promise<void> {
    const { error } = await this.client.from('work_records').delete().eq('id', id);
    if (error) throw new Error(`删除工作内容失败: ${error.message}`);
  }
}
