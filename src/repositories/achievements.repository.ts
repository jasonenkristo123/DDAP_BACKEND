import { prismaClient } from "../lib/prisma.js"
import type { difficulty } from "@prisma/client"

export interface GetAchievementsParams {
  search?: string | undefined;
  difficulty?: difficulty | undefined;
  order?: "asc" | "desc" | undefined;
}

export const achievementRepository = {
    getAllAchievements: async (params?: GetAchievementsParams) => {
        const { search, difficulty, order } = params || {};

        const whereClause: any = {};

        if (difficulty) {
            whereClause.difficulty = difficulty;
        }

        if (search && search.trim() !== "") {
            whereClause.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } }
            ];
        }

        return await prismaClient.achievements.findMany({
            where: whereClause,
            orderBy: {
                title: order || "asc"
            }
        });
    },
    
    getUserAchievements: async (userId: number) => {
    return await prismaClient.users_achievement.findMany({
      where: { id_user: userId },
      include: {
        achievements: true 
      },
      orderBy: { completed_at: 'desc' }
    });
  },

  checkHasAchievement: async (userId: number, achievementId: number) => {
    return await prismaClient.users_achievement.findFirst({
      where: { id_user: userId, id_achievement: achievementId }
    });
  },

  unlockAchievement: async (userId: number, achievementId: number) => {
    return await prismaClient.users_achievement.create({
      data: {
        id_user: userId,
        id_achievement: achievementId,
        completed_at: new Date()
      }
    })
  }
}