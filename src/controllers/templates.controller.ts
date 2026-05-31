import type { Request, Response } from "express";
import { templateService } from "../service/templates.service.js";

export const templateController = {
  getTemplates: async (req: Request, res: Response): Promise<void> => {
    try {
      const search = req.query.search as string;
      const templates = await templateService.getTemplates(search);

      res.status(200).json({
        message: "Templates berhasil diambil",
        data: templates,
      });
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil template" });
    }
  },

  createTemplate: async (req: Request, res: Response): Promise<void> => {
    try {
      const newTemplate = await templateService.createTemplates(req.body);
      res
        .status(201)
        .json({ message: "Template berhasil dibuat", data: newTemplate });
    } catch (error) {
      res.status(500).json({ error: "Gagal membuat template" });
    }
  },

  useTemplate: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = 1;
      const templateId = Number(req.params.id);
      const generatedTodo = await templateService.useTemplate(
        BigInt(templateId),
        userId,
      );

      res.status(201).json({
        message: "Todo berhasil dibuat dari template!",
        data: generatedTodo,
      });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  },
  deleteTemplate: async (req: Request, res: Response): Promise<void> => {
    try {
      const templateId = Number(req.params.id);
      await templateService.deleteTemplate(BigInt(templateId));
      res.status(200).json({ message: "Template berhasil dihapus" });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  },
  updateTemplate: async (req: Request, res: Response): Promise<void> => {
    try {
      const templateId = Number(req.params.id);
      const updatedTemplate = await templateService.updateTemplate(
        BigInt(templateId),
        req.body,
      );
      res.status(200).json({ message: "Template berhasil diupdate" });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  },
};
