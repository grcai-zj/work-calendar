import { sql } from "drizzle-orm"
import { pgTable, serial, timestamp, varchar, text, integer, real, index } from "drizzle-orm/pg-core"

export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 分类表（大类/小类，支持工作内容分类和待办事项分类）
export const categories = pgTable(
  "categories",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    parent_id: varchar("parent_id", { length: 36 }),
    name: varchar("name", { length: 100 }).notNull(),
    type: varchar("type", { length: 20 }).notNull(), // 'work' | 'todo'
    level: integer("level").notNull().default(1), // 1=大类, 2=小类
    sort_order: integer("sort_order").notNull().default(0),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("categories_type_idx").on(table.type),
    index("categories_parent_id_idx").on(table.parent_id),
  ]
);

// 工作内容记录表
export const workRecords = pgTable(
  "work_records",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    category_id: varchar("category_id", { length: 36 }).notNull().references(() => categories.id),
    sub_category_id: varchar("sub_category_id", { length: 36 }).references(() => categories.id),
    content: text("content").notNull(),
    hours: real("hours").notNull().default(0),
    record_date: varchar("record_date", { length: 10 }).notNull(), // YYYY-MM-DD
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("work_records_record_date_idx").on(table.record_date),
    index("work_records_category_id_idx").on(table.category_id),
    index("work_records_sub_category_id_idx").on(table.sub_category_id),
  ]
);

// 待办事项表
export const todos = pgTable(
  "todos",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    category_id: varchar("category_id", { length: 36 }).notNull().references(() => categories.id),
    sub_category_id: varchar("sub_category_id", { length: 36 }).references(() => categories.id),
    content: text("content").notNull(),
    related_person: varchar("related_person", { length: 100 }),
    priority: varchar("priority", { length: 30 }).notNull().default("urgent_important"),
    // 'urgent_important' | 'important_not_urgent' | 'urgent_not_important' | 'not_urgent_not_important'
    deadline: varchar("deadline", { length: 10 }), // YYYY-MM-DD
    status: varchar("status", { length: 20 }).notNull().default("not_started"),
    // 'not_started' | 'in_progress' | 'completed'
    parent_todo_id: varchar("parent_todo_id", { length: 36 }), // 用于分解子项
    hours: real("hours").default(0), // 完成时记录的耗时
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("todos_status_idx").on(table.status),
    index("todos_priority_idx").on(table.priority),
    index("todos_deadline_idx").on(table.deadline),
    index("todos_category_id_idx").on(table.category_id),
    index("todos_parent_todo_id_idx").on(table.parent_todo_id),
  ]
);
