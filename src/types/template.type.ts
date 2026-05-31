import type { category, priority } from "@prisma/client";

export interface CreateTemplateDTO {
    title: string;
    description: string;
    category: category;
    priority: priority;
    due_days: number;
}