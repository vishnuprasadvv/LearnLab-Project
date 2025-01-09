import { Request, Response, Router } from "express";
import { signUp , loginHandler, sendOtpHandler, verifyOtpHandler, refreshTokenHandler, logoutHandler, validateUser, resetPasswordOtpSendHandler, resetPasswordHandler, googleLoginSuccess, googleLoginFailure, adminLogoutHandler, adminLoginHandler, getUserDataController, validateAdmin, } from "../controllers/authController";
import passport from "passport";
import { googleLogin } from "../controllers/googleAuthLibrary";
import { registerInstuctorHandler } from "../controllers/instructor/instructorController";
import { authorizeRole, isAuthenticated } from "../middlewares/authMiddleware";
import { changePasswordHandler, editProfileEmailController, editProfileHandler } from "../controllers/student/profile/profileController";



const router = Router();

router.post('/signup', signUp);
router.post ('/login', loginHandler)

router.post('/send-otp', sendOtpHandler)
router.post('/verify-otp', verifyOtpHandler)
router.post('/logout', logoutHandler)
router.post('/verify-user-token', validateUser)
router.post('/verify-admin-token', validateAdmin)
router.post('/forgot-password', resetPasswordOtpSendHandler)
router.post('/reset-password', resetPasswordHandler)

router.post('/refresh-token', refreshTokenHandler)

router.post('/google', googleLogin )

//instructor register
router.post('/instructor-register', registerInstuctorHandler)

//user profile
router.use( isAuthenticated, authorizeRole(['student','instructor']),)
    .post('/profile/change-password',changePasswordHandler)
    .post('/profile/edit', editProfileHandler)
    .patch('/profile/edit/email', editProfileEmailController)
    .get('/user-data/:userId', getUserDataController )

export default router;