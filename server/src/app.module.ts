import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { CategoriesModule } from '@/categories/categories.module';
import { WorkRecordsModule } from '@/work-records/work-records.module';
import { TodosModule } from '@/todos/todos.module';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [CategoriesModule, WorkRecordsModule, TodosModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
