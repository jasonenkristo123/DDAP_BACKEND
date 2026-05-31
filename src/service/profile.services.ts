import "multer";
import { profileRepository } from "../repositories/profile.repository.js"
import type { dataProfile } from "../types/profile.type.js";
import cloudinary from "../lib/cloudinary.js";

export const profileService = {
    getProfile: async (userId: number) => {
        const profile = await profileRepository.getUserById(userId);

        if (!profile) {
            throw new Error('User not found')
        }

        return profile
    },

    updateProfile: async (userId: number, updatedData: dataProfile, file?: Express.Multer.File) => {
        let uploadedImageUrl: string | undefined = undefined;

        if (file) {
            const b64 = Buffer.from(file.buffer).toString('base64');
            const dataURI = `data:${file.mimetype};base64,${b64}`

            const uploadResult = await cloudinary.uploader.upload(dataURI, {
                folder: 'todo_app_profiles',
                resource_type: 'image'
            });

            uploadedImageUrl = uploadResult.secure_url;
        }

        const finalDataToUpdate: dataProfile = {
            ...updatedData,
            ...(uploadedImageUrl && {
                profilePhotoUrl: uploadedImageUrl
            })
        }
        return await profileRepository.updateProfile(userId, finalDataToUpdate);
    }
}