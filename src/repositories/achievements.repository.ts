import { prismaClient } from "../lib/prisma.js"

export const achievementRepository = {
    getAllAchievements: async () => {
        return await prismaClient.achievements.findMany({
            orderBy: {
                id_achievement: 'asc'
            }
        })
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