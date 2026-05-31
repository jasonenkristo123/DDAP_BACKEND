import { Router } from "express";
import { templateController } from "../controllers/templates.controller.js";


const templateRoutes = Router();

templateRoutes.get('/', templateController.getTemplates);
templateRoutes.post('/', templateController.createTemplate);
templateRoutes.post('/:id/use', templateController.useTemplate);
templateRoutes.put('/:id', templateController.updateTemplate);
templateRoutes.delete('/:id', templateController.deleteTemplate);

export default templateRoutes