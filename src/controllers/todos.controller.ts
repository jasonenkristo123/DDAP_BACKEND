import type { Request, Response } from "express";

import { todoService } from "../service/todos.service.js";



const capitalize = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

// Status has irregular casing (ToDo, In_Progress) so we use an explicit map
// Accepts any variant the frontend might send
const normalizeStatus = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  const lookup: Record<string, string> = {
    todo:        "ToDo",
    ToDo:        "ToDo",
    in_progress: "In_Progress",
    inprogress:  "In_Progress",
    "in progress": "In_Progress",
    In_Progress: "In_Progress",
    done:        "Done",
    Done:        "Done",
  };
  return lookup[value] ?? value; // fallback: pass through as-is
};

// Converts Prisma enum keys back to human-readable values for API responses
// e.g. "In_Progress" → "In Progress"
const serializeTodo = (todo: Record<string, unknown>) => ({
  ...todo,
  status: todo.status === "In_Progress" ? "In Progress" : todo.status,
});

export const todoController = {
  getTodos: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = 1;

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const sortBy =
        (req.query.sortBy as string) === "priority" ? "priority" : "created_at";
      const order = (req.query.orderBy as string) === "asc" ? "asc" : "desc";

      const category = req.query.category as string;
      const search = req.query.search as string | undefined;

      const result = await todoService.getTodos({
        userId: BigInt(userId),
        page,
        limit,
        sortBy,
        order,
        category,
        ...(search !== undefined && { search }),
      });

      res.status(200).json({
        message: "Successfully get all todos",
        data: result.data.map(serializeTodo),
        meta: {
          totalItems: result.totalItems,
          itemCount: result.data.length,
          itemsPerPage: limit,
          totalPages: Math.ceil(result.totalItems / limit),
          currentPage: page,
        },
      });
    } catch (error) {
      console.error("Get todos error", error);
      res.status(500).json({
        message: "Get todos failed",
        error: (error as Error).message,
      });
    }
  },

  createTodo: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = 1;
      const todoData = {
        ...req.body,
        priority: capitalize(req.body.priority),
        category: capitalize(req.body.category),
      };

      const newTodo = await todoService.createTodo(userId, todoData);
      res.status(200).json({
        message: "todo berhasil di buat",
        data: serializeTodo(newTodo as Record<string, unknown>),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "gagal membuat todos",
        error: (error as Error).message,
      });
    }
  },

  updateTodo: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = 1;
      const todoId = Number(req.params.id);
      const updateData = {
        ...req.body,
        ...(req.body.priority && { priority: capitalize(req.body.priority) }),
        ...(req.body.category && { category: capitalize(req.body.category) }),
        ...(req.body.status   && { status:   normalizeStatus(req.body.status) }),
      };

      if (isNaN(todoId)) {
        res.status(400).json({
          message: "id tidak valid",
        });
        return;
      }

      const updatedTodo = await todoService.updateTodo(
        todoId,
        userId,
        updateData,
      );

      res.status(200).json({
        message: "update berhasil",
        data: serializeTodo(updatedTodo as Record<string, unknown>),
      });
    } catch (error) {
      console.error(error);
      if ((error as Error).message.includes("tidak ditemukan")) {
        res.status(404).json({ error: (error as Error).message });
      } else {
        res.status(500).json({ error: "Gagal mengupdate Todo" });
      }
    }
  },

  deleteTodo: async (req: Request, res: Response) => {
    try {
        const todoId = Number(req.params.id);
        if (isNaN(todoId)) {
            res.status(400).json({
                message: "id tidak valid"
            })
            return;
        }

        const deletedTodo = await todoService.deleteTodo(todoId);
        res.status(200).json({
            message: "delete berhasil",
            data: serializeTodo(deletedTodo as Record<string, unknown>),
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "gagal menghapus todos"
        })
    }
  }
};
