
import { prismaClient } from "../lib/prisma.js";
import type { CreateTemplateDTO } from "../types/template.type.js";

export const templateRepository = {
  getTemplates: async (search?: string) => {
    return await prismaClient.templates.findMany({
      where: search
        ? {
            title: {
              contains: search,
              mode: "insensitive",
            },
          }
        : {},
      orderBy: {
        created_at: "desc",
      },
    });
  },

  getTemplateById: async (templateId: bigint) => {
    return await prismaClient.templates.findUnique({
      where: {
        id_template: templateId,
      },
    });
  },

  createTemplate: async (data: CreateTemplateDTO) => {
    return await prismaClient.templates.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        due_days: data.due_days,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  },

  deleteTemplate: async (templateId: bigint) => {
    return await prismaClient.templates.delete({
      where: {
        id_template: templateId,
      },
    });
  },

  updateTemplate: async (
    templateId: bigint,
    updatedData: CreateTemplateDTO,
  ) => {
    return await prismaClient.templates.update({
      where: {
        id_template: templateId,
      },
      data: {
        title: updatedData.title,
        description: updatedData.description,
        category: updatedData.category,
        priority: updatedData.priority,
        due_days: updatedData.due_days,
        updated_at: new Date(),
      },
    });
  },
};
