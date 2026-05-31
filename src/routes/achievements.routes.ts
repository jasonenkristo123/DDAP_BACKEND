import { Router } from "express";
import { achievementController } from "../controllers/achievements.controller.js";

const achievementsRoutes = Router();

achievementsRoutes.get("/", achievementController.getAllAchievements);
achievementsRoutes.get("/:userId", achievementController.getUserAchievements);

export default achievementsRoutes;