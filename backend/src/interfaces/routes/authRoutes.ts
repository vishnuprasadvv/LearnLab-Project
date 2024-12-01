import { Request, Response, Router } from "express";
import { signUp , loginHandler, sendOtpHandler, verifyOtpHandler, refreshTokenHandler, logoutHandler, validateUser, resetPasswordOtpSendHandler, resetPasswordHandler, googleLoginSuccess, googleLoginFailure, adminLogoutHandler, adminLoginHandler, } from "../controllers/authController";
import passport from "passport";
import { googleLogin } from "../controllers/googleAuthLibrary";
import { registerInstuctorHandler } from "../controllers/instructorController";



const router = Router();

router.post('/signup', signUp);
router.post ('/login', loginHandler)

router.post('/send-otp', sendOtpHandler)
router.post('/verify-otp', verifyOtpHandler)
router.post('/logout', logoutHandler)
router.post('/verify-user-token', validateUser)
router.post('/forgot-password', resetPasswordOtpSendHandler)
router.post('/reset-password', resetPasswordHandler)

router.post('/refresh-token', refreshTokenHandler)

router.post('/google', googleLogin )

//instructor register
router.post('/instructor-register', registerInstuctorHandler)


export default router;