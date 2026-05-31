import { achievementService } from "../service/achievements.service.js"
import type { Request, Response } from "express"

export const achievementController = {
    getAllAchievements: async (req: Request, res: Response) => {
        try {
            const data = await achievementService.getAllAchievements();

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