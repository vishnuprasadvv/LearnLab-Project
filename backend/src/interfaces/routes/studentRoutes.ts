import { Router } from "express";
import { isAuthenticated, authorizeRole } from "../middlewares/authMiddleware";
import { studentHome } from "../controllers/studentController";

const router = Router();

router.get('/home', isAuthenticated, authorizeRole(['student']), studentHome)
router.post('/profile/change-password', isAuthenticated, authorizeRole(['student']), studentHome)


export default router;