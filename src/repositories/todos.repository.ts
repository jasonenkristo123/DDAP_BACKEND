import { prismaClient } from "../lib/prisma.js";
import type {
  CreateTodoDTO,
  GetTodosParams,
  UpdateTodoDTO,
} from "../types/todos.type.js";

export const todoRepository = {
  getTodos: async (params: GetTodosParams) => {
    const { userId, page, limit, sortBy, order, category } = params;

    const skip = (page - 1) * limit;

    const whereClause: any = {
      id_user: userId,
    };

    if (category && category.toLocaleLowerCase() !== "all") {
      whereClause.category = category;
    }

    const orderByClause: any = {};

    if (sortBy === "priority") {
      orderByClause.priority = order;
    } else if (sortBy === "created_at") {
      orderByClause.created_at = order;
    }

    const [totalItems, data] = await Promise.all([
      prismaClient.todos.count({
        where: whereClause,
      }),
      prismaClient.todos.findMany({
        where: whereClause,
        skip: skip,
        take: limit,
        orderBy: orderByClause,
      }),
    ]);

    return {
      totalItems,
      data,
    };
  },

  createTodo: async (userId: bigint, data: CreateTodoDTO) => {
    return await prismaClient.todos.create({
      data: {
        id_user: userId,
        title: data.title,
        description: data.description ?? null,
        priority: data.priority,
        category: data.category,
        created_at: new Date(),
        due_date: data.due_date ? new Date(data.due_date) : null,
      },
    });
  },

  updateTodo: async (todoId: number, data: UpdateTodoDTO) => {
    return await prismaClient.todos.update({
      where: {
        id_todo: todoId,
      },
      data: data,
    });
  },

  getTodoByIdAndUser: async (todoId: number, userId: number) => {
    return await prismaClient.todos.findFirst({
      where: { id_todo: todoId, id_user: userId },
    });
  },

  deleteTodo: async (todoId: number) => {
    return await prismaClient.todos.delete({
      where: {
        id_todo: todoId,
      },
    });
  },
};
