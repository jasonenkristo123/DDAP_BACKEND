import { prismaClient } from "../lib/prisma.js";
import type { dataProfile } from "../types/profile.type.js";

export const profileRepository = {
  getUserById: async (userId: number) => {
    return await prismaClient.users.findUnique({
      where: {
        id_user: userId,
      },
    });
  },

  updateProfile: async (userId: number, data: dataProfile) => {
    return await prismaClient.users.update({
      where: {
        id_user: userId,
      },
      data: data,
    });
  },
};
