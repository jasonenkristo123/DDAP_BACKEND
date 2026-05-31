import { priority } from "@prisma/client";
import { templateRepository } from "../repositories/templates.repository.js";
import type { CreateTemplateDTO } from "../types/template.type.js";
import { todoRepository } from "../repositories/todos.repository.js";

export const templateService = {
  getTemplates: async (search?: string) => {
    return await templateRepository.getTemplates(search);
  },

  createTemplates: async (data: CreateTemplateDTO) => {
    return await templateRepository.createTemplate(data);
  },

  useTemplate: async (templateId: bigint, userId: number) => {
    const template = await templateRepository.getTemplateById(templateId);

    if (!template) {
      throw new Error("Template tidak ditemukan");
    }

    const calculatedData = new Date();

    if (template.due_days > 0) {
      calculatedData.setDate(calculatedData.getDate() + template.due_days);
    }

    const newTodoData = {
      title: template.title,
      description: template.description,
      category: template.category,
      priority: template.priority || "Medium",
      due_date: calculatedData.toISOString(),
    };

    return await todoRepository.createTodo(BigInt(userId), newTodoData);
  },

  updateTemplate: async (
    templateId: bigint,
    updatedData: CreateTemplateDTO,
  ) => {
    return await templateRepository.updateTemplate(templateId, updatedData);
  },

  deleteTemplate: async (templateId: bigint) => {
    return await templateRepository.deleteTemplate(templateId);
  },
};
