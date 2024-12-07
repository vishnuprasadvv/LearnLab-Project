import { Router } from "express";
import { isAuthenticated, authorizeRole } from "../middlewares/authMiddleware";
import { studentHome, updateProfileImageController } from "../controllers/studentController";
import { upload } from "../../infrastructure/middlewares/multer";

const router = Router();

router.get('/home', isAuthenticated, authorizeRole(['student']), studentHome)
router.post('/profile/:id/update-image', upload.single('profileImage'), updateProfileImageController)


export default router;