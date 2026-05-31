import { prismaClient } from "../lib/prisma.js";
import { achievementRepository } from "../repositories/achievements.repository.js";

export const achievementService = {
  getAllAchievements: async () => {
    return await achievementRepository.getAllAchievements();
  },

  getUserAchievements: async (userId: number) => {
    return await achievementRepository.getUserAchievements(userId);
  },

  checkAndUnlockTodoMilestones: async (userId: number) => {
    const totalTodos = await prismaClient.todos.count({
      where: {
        id_user: userId,
      },
    });

    let targetAchievementId: number | null = null;

    if (totalTodos === 1) targetAchievementId = 1;
    else if (totalTodos === 25) targetAchievementId = 2;
    else if (totalTodos === 100) targetAchievementId = 3;

    if (targetAchievementId !== null) {
      const alreadyUnlocked = await achievementRepository.checkHasAchievement(
        userId,
        targetAchievementId,
      );

      if (!alreadyUnlocked) {
        await achievementRepository.unlockAchievement(
          userId,
          targetAchievementId,
        );
        console.log("user unlocked achievements");
      }
    }
  },

  getAchievementsWithUserStatus: async (userId: number) => {
    const allAchievements = await achievementRepository.getAllAchievements();

    const userUnlocked =
      await achievementRepository.getUserAchievements(userId);

    const combinedData = allAchievements.map((master) => {
      const unlockedData = userUnlocked.find(
        (u) => u.id_achievement === master.id_achievement,
      );

      return {
        id_achievement: master.id_achievement,
        title: master.title,
        description: master.description,
        difficulty: master.difficulty,
        icon_url: master.icon_url,
        is_unlocked: !!unlockedData,
        completed_at: unlockedData ? unlockedData.completed_at : null,
      };
    });

    return combinedData;
  },
};
