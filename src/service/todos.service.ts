import { todoRepository } from "../repositories/todos.repository.js";
import type {
  CreateTodoDTO,
  GetTodosParams,
  UpdateTodoDTO,
} from "../types/todos.type.js";

export const todoService = {
  getTodos: async (params: GetTodosParams) => {
    return await todoRepository.getTodos(params);
  },

  createTodo: async (userId: number, data: CreateTodoDTO) => {
    return await todoRepository.createTodo(BigInt(userId), data);
  },

  updateTodo: async (todoId: number, userId: number, data: UpdateTodoDTO) => {
    const existingTodo = await todoRepository.getTodoByIdAndUser(
      todoId,
      userId,
    );

    if (!existingTodo) {
      throw new Error("Todo tidak di temukan");
    }

    const finalUpdateData: any = {...data};

    if (data.due_date) {
      finalUpdateData.due_date = new Date(data.due_date);
    }

    if (data.status) {
      if (data.status === 'Done' && existingTodo.status !== 'Done') {
        finalUpdateData.done_at = new Date();
      } else if (data.status !== 'Done' && existingTodo.status === 'Done') {
        finalUpdateData.done_at = null
      }
    }

    return await todoRepository.updateTodo(todoId, finalUpdateData);
  },

  deleteTodo: async (todoId: number) => {
    return await todoRepository.deleteTodo(todoId);
  }
};
