import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers, HttpCode } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @HttpCode(200)
  async findAll(
    @Query('type') type?: string,
    @Query('level') level?: string,
    @Headers('x-user-id') userId?: string,
  ) {
    const levelNum = level ? parseInt(level, 10) : undefined;
    const data = await this.categoriesService.findAll(type, levelNum, userId);
    return { code: 200, msg: 'success', data };
  }

  @Get('tree')
  @HttpCode(200)
  async findTree(
    @Query('type') type?: string,
    @Headers('x-user-id') userId?: string,
  ) {
    const data = await this.categoriesService.findTree(type, userId);
    return { code: 200, msg: 'success', data };
  }

  @Post()
  @HttpCode(200)
  async create(
    @Body() body: { name: string; type: string; parent_id?: string; level?: number; sort_order?: number },
    @Headers('x-user-id') userId?: string,
  ) {
    const data = await this.categoriesService.create({ ...body, user_id: userId });
    return { code: 200, msg: 'success', data };
  }

  @Put(':id')
  @HttpCode(200)
  async update(@Param('id') id: string, @Body() body: { name?: string; sort_order?: number; hidden?: boolean }) {
    const data = await this.categoriesService.update(id, body);
    return { code: 200, msg: 'success', data };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(id);
    return { code: 200, msg: 'success', data: null };
  }
}
