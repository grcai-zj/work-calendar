import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';
import { WorkRecordsService } from './work-records.service';

@Controller('work-records')
export class WorkRecordsController {
  constructor(private readonly workRecordsService: WorkRecordsService) {}

  @Get()
  @HttpCode(200)
  async findByDate(@Query('date') date: string) {
    const data = await this.workRecordsService.findByDate(date);
    return { code: 200, msg: 'success', data };
  }

  @Get('range')
  @HttpCode(200)
  async findByDateRange(@Query('start_date') startDate: string, @Query('end_date') endDate: string) {
    const data = await this.workRecordsService.findByDateRange(startDate, endDate);
    return { code: 200, msg: 'success', data };
  }

  @Post()
  @HttpCode(200)
  async create(@Body() body: { category_id: string; sub_category_id?: string; content: string; hours?: number; record_date: string }) {
    const data = await this.workRecordsService.create(body);
    return { code: 200, msg: 'success', data };
  }

  @Put(':id')
  @HttpCode(200)
  async update(@Param('id') id: string, @Body() body: { category_id?: string; sub_category_id?: string; content?: string; hours?: number; record_date?: string }) {
    const data = await this.workRecordsService.update(id, body);
    return { code: 200, msg: 'success', data };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string) {
    await this.workRecordsService.remove(id);
    return { code: 200, msg: 'success', data: null };
  }
}
