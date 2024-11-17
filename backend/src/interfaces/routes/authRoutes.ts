import { Router } from "express";
import { signUp , loginHandler, sendOtpHandler, verifyOtpHandler, refreshTokenHandler, logoutHandler } from "../controllers/authController";

const router = Router();

router.post('/signup', signUp);
router.post ('/login', loginHandler)
router.post('/send-otp', sendOtpHandler)
router.post('/verify-otp', verifyOtpHandler)
router.post('/logout', logoutHandler)

router.post('/refresh-token', refreshTokenHandler)



export default router;