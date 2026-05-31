import type { category, priority, status } from "@prisma/client";

export interface GetTodosParams {
  userId: bigint;
  page: number;
  limit: number;
  sortBy: "created_at" | "priority";
  order: "asc" | "desc";
  category?: string;
  search?: string;
}

export interface CreateTodoDTO {
  title: string;
  description?: string;
  priority: priority;
  category: category;
  due_date?: string;
  
}

export interface UpdateTodoDTO {
  title?: string;
  description?: string;
  priority?: priority;
  category?: category;
  status?: status; 
  done_at?: Date;
  due_date?: string;
}