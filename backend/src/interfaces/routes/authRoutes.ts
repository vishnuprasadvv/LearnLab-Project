import { Router } from "express";
import { signUp , loginHandler, sendOtpHandler, verifyOtpHandler } from "../controllers/authController";

const router = Router();

router.post('/signup', signUp);
router.post ('/login', loginHandler)
router.post('/send-otp', sendOtpHandler)
router.post('/verify-otp', verifyOtpHandler)

export default router;