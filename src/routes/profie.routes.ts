import { Router } from "express";
import multer from "multer";
import { profileController } from "../controllers/profile.controller.js";



const profileRoutes = Router();
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})


profileRoutes.get('/:id/profile', profileController.getProfile);
profileRoutes.put('/:id/profile', upload.single('profilePhoto'), profileController.updateProfile)

export default profileRoutes;