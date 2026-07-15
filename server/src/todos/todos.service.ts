import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export interface Todo {
  id: string;
  category_id: string;
  sub_category_id: string | null;
  content: string;
  related_person: string | null;
  priority: string;
  deadline: string | null;
  status: string;
  parent_todo_id: string | null;
  hours: number | null;
  user_id?: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string | null;
  category_name?: string;
  sub_category_name?: string;
  children?: Todo[];
}

@Injectable()
export class TodosService {
  private get client() {
    return getSupabaseClient();
  }

  // 查询待办事项（支持筛选和排序）
  async findAll(filters: {
    status?: string;
    priority?: string;
    category_id?: string;
    deadline?: string;
    deadline_before?: string;
    sort_by?: string;
    sort_order?: string;
    parent_todo_id?: string;
    userId?: string;
  }): Promise<Todo[]> {
    let query = this.client
      .from('todos')
      .select('id, category_id, sub_category_id, content, related_person, priority, deadline, status, parent_todo_id, hours, user_id, completed_at, created_at, updated_at');

    // 如果指定了 parent_todo_id，则查询子项
    if (filters.parent_todo_id) {
      query = query.eq('parent_todo_id', filters.parent_todo_id);
    } else {
      query = query.is('parent_todo_id', null); // 只查主待办
    }

    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    if (filters.deadline_before) {
      query = query.lte('deadline', filters.deadline_before);
    } else if (filters.deadline) {
      query = query.eq('deadline', filters.deadline);
    }

    const sortBy = filters.sort_by || 'created_at';
    const sortOrder = filters.sort_order === 'asc' ? { ascending: true } : { ascending: false };
    const { data, error } = await query.order(sortBy, sortOrder);
    if (error) throw new Error(`查询待办事项失败: ${error.message}`);

    const todos = data as Todo[];
    if (todos.length === 0) return [];

    // 批量获取分类名称
    const categoryIds = [...new Set(todos.flatMap(t => [t.category_id, t.sub_category_id].filter(Boolean)))];
    if (categoryIds.length > 0) {
      const { data: categories, error: catError } = await this.client
        .from('categories')
        .select('id, name')
        .in('id', categoryIds);
      if (catError) throw new Error(`查询分类失败: ${catError.message}`);
      const catMap = new Map((categories || []).map(c => [c.id, c.name]));
      todos.forEach(t => {
        t.category_name = catMap.get(t.category_id) || '';
        t.sub_category_name = t.sub_category_id ? (catMap.get(t.sub_category_id) || '') : '';
      });
    }

    // 加载子项
    const todoIds = todos.map(t => t.id);
    if (todoIds.length > 0) {
      const { data: subItems, error: subError } = await this.client
        .from('todos')
        .select('id, category_id, sub_category_id, content, related_person, priority, deadline, status, parent_todo_id, hours, user_id, completed_at, created_at, updated_at')
        .in('parent_todo_id', todoIds)
        .order('created_at', { ascending: true });
      if (subError) throw new Error(`查询子项失败: ${subError.message}`);

      const subMap = new Map<string, Todo[]>();
      (subItems || []).forEach((item: Todo) => {
        const list = subMap.get(item.parent_todo_id!) || [];
        list.push(item);
        subMap.set(item.parent_todo_id!, list);
      });
      todos.forEach(t => {
        t.children = subMap.get(t.id) || [];
      });
    }

    return todos;
  }

  // 查询截止日期前未完成的待办
  async findPendingByDeadline(deadline: string, userId?: string): Promise<Todo[]> {
    let query = this.client
      .from('todos')
      .select('id, category_id, sub_category_id, content, related_person, priority, deadline, status, parent_todo_id, hours, user_id, completed_at, created_at, updated_at')
      .lte('deadline', deadline)
      .neq('status', 'completed')
      .is('parent_todo_id', null)
      .order('priority')
      .order('deadline', { ascending: true });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw new Error(`查询待办事项失败: ${error.message}`);

    const todos = data as Todo[];
    if (todos.length === 0) return [];

    // 批量获取分类名称
    const categoryIds = [...new Set(todos.flatMap(t => [t.category_id, t.sub_category_id].filter(Boolean)))];
    if (categoryIds.length > 0) {
      const { data: categories, error: catError } = await this.client
        .from('categories')
        .select('id, name')
        .in('id', categoryIds);
      if (catError) throw new Error(`查询分类失败: ${catError.message}`);
      const catMap = new Map((categories || []).map(c => [c.id, c.name]));
      todos.forEach(t => {
        t.category_name = catMap.get(t.category_id) || '';
        t.sub_category_name = t.sub_category_id ? (catMap.get(t.sub_category_id) || '') : '';
      });
    }
    return todos;
  }

  // 创建待办事项
  async create(body: {
    category_id: string;
    sub_category_id?: string;
    content: string;
    related_person?: string;
    priority?: string;
    deadline?: string;
    parent_todo_id?: string;
    user_id?: string;
  }): Promise<Todo> {
    const insertData: any = {
      category_id: body.category_id,
      content: body.content,
      priority: body.priority || 'urgent_important',
      status: 'not_started',
    };
    if (body.sub_category_id) insertData.sub_category_id = body.sub_category_id;
    if (body.related_person) insertData.related_person = body.related_person;
    if (body.deadline) insertData.deadline = body.deadline;
    if (body.parent_todo_id) insertData.parent_todo_id = body.parent_todo_id;
    if (body.user_id) insertData.user_id = body.user_id;

    const { data, error } = await this.client
      .from('todos')
      .insert(insertData)
      .select('id, category_id, sub_category_id, content, related_person, priority, deadline, status, parent_todo_id, hours, user_id, completed_at, created_at, updated_at')
      .single();
    if (error) throw new Error(`创建待办事项失败: ${error.message}`);
    return data as Todo;
  }

  // 更新待办事项
  async update(id: string, body: {
    category_id?: string;
    sub_category_id?: string;
    content?: string;
    related_person?: string;
    priority?: string;
    deadline?: string;
    status?: string;
    hours?: number;
  }): Promise<Todo> {
    const updateData: any = {};
    if (body.category_id !== undefined) updateData.category_id = body.category_id;
    if (body.sub_category_id !== undefined) updateData.sub_category_id = body.sub_category_id;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.related_person !== undefined) updateData.related_person = body.related_person;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.deadline !== undefined) updateData.deadline = body.deadline;
    if (body.status !== undefined) {
      updateData.status = body.status;
      // Set completed_at when status changes to completed
      if (body.status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      } else {
        updateData.completed_at = null;
      }
    }
    if (body.hours !== undefined) updateData.hours = body.hours;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await this.client
      .from('todos')
      .update(updateData)
      .eq('id', id)
      .select('id, category_id, sub_category_id, content, related_person, priority, deadline, status, parent_todo_id, hours, user_id, completed_at, created_at, updated_at')
      .single();
    if (error) throw new Error(`更新待办事项失败: ${error.message}`);
    return data as Todo;
  }

  // 删除待办事项（同时删除子项）
  async remove(id: string): Promise<void> {
    const { error: childError } = await this.client.from('todos').delete().eq('parent_todo_id', id);
    if (childError) throw new Error(`删除子项失败: ${childError.message}`);
    const { error } = await this.client.from('todos').delete().eq('id', id);
    if (error) throw new Error(`删除待办事项失败: ${error.message}`);
  }
}
