import { Router } from "express";
import { todoController } from "../controllers/todos.controller.js";

const todosRoutes = Router();

todosRoutes.get("/", todoController.getTodos);
todosRoutes.post("/", todoController.createTodo);
todosRoutes.patch("/:id", todoController.updateTodo);
todosRoutes.delete("/:id", todoController.deleteTodo);

export default todosRoutes;