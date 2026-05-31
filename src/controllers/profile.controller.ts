import type { Request, Response } from "express"
import { profileService } from "../service/profile.services.js";
import type { dataProfile } from "../types/profile.type.js";

export const profileController = {
    getProfile: async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = Number(req.params.id);

            if (isNaN(userId)) {
                res.status(400).json({
                    message: 'ID user tidak valid'
                });
                return;
            }

            const profile = await profileService.getProfile(userId);
            res.status(200).json({
                data: profile,
                message: "Successfully retreived profile"
            })
        } catch (error) {
            res.status(404).json({
                error: (error as Error).message || 'Terjadi kesalahan saat mengambil profil'
            })

        }
    },

    updateProfile: async (req: Request, res: Response): Promise<void> => {
        try {
         const userId = Number(req.params.id);

         if (isNaN(userId)) {
            res.status(400).json({
                message: 'ID user tidak valid'
            })
            return;
         }

         const updateData: dataProfile = req.body;
         const file = req.file;

         const updatedProfile = await profileService.updateProfile(userId, updateData, file);

         res.status(200).json({
            message: 'Profil berhasil diperbarui',
            data: updatedProfile
         })

        } catch (error) {
            console.error("Error when update profile:",error);
            res.status(500).json({
                message: "Gagal Memperbarui Profil"
            })
        }
    }
}