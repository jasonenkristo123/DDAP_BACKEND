import { achievementService } from "../service/achievements.service.js"
import type { Request, Response } from "express"
import type { difficulty } from "@prisma/client"

const capitalize = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const achievementController = {
    getAllAchievements: async (req: Request, res: Response) => {
        try {
            const userId = 1;

            const search = req.query.search as string | undefined;
            const difficultyInput = req.query.difficulty as string | undefined;
            const orderInput = req.query.order as string || req.query.orderBy as string;

            let difficultyParam: difficulty | undefined;
            if (difficultyInput) {
                const capitalized = capitalize(difficultyInput);
                if (capitalized === "Easy" || capitalized === "Medium" || capitalized === "Hard") {
                    difficultyParam = capitalized as difficulty;
                }
            }

            const order = orderInput === "desc" ? "desc" : "asc";

            const data = await achievementService.getAchievementsWithUserStatus(userId, {
                search,
                difficulty: difficultyParam,
                order
            });

            res.status(200).json({
                message: 'Success',
                data
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: 'Internal server error'
            })
        }
    },

    getUserAchievements: async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.userId);
            const data = await achievementService.getUserAchievements(userId);

            res.status(200).json({
                message: 'Success',
                data
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: 'Internal server error'
            })
        }
    }
}