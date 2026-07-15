import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  @HttpCode(200)
  async findAll(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('category_id') categoryId?: string,
    @Query('deadline') deadline?: string,
    @Query('deadline_before') deadlineBefore?: string,
    @Query('sort_by') sortBy?: string,
    @Query('sort_order') sortOrder?: string,
  ) {
    const data = await this.todosService.findAll({
      status,
      priority,
      category_id: categoryId,
      deadline,
      deadline_before: deadlineBefore,
      sort_by: sortBy,
      sort_order: sortOrder,
    });
    return { code: 200, msg: 'success', data };
  }

  @Get('pending')
  @HttpCode(200)
  async findPendingByDeadline(@Query('deadline') deadline: string) {
    const data = await this.todosService.findPendingByDeadline(deadline);
    return { code: 200, msg: 'success', data };
  }

  @Post()
  @HttpCode(200)
  async create(@Body() body: {
    category_id: string;
    sub_category_id?: string;
    content: string;
    related_person?: string;
    priority?: string;
    deadline?: string;
    parent_todo_id?: string;
  }) {
    const data = await this.todosService.create(body);
    return { code: 200, msg: 'success', data };
  }

  @Put(':id')
  @HttpCode(200)
  async update(@Param('id') id: string, @Body() body: {
    category_id?: string;
    sub_category_id?: string;
    content?: string;
    related_person?: string;
    priority?: string;
    deadline?: string;
    status?: string;
    hours?: number;
  }) {
    const data = await this.todosService.update(id, body);
    return { code: 200, msg: 'success', data };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string) {
    await this.todosService.remove(id);
    return { code: 200, msg: 'success', data: null };
  }
}
