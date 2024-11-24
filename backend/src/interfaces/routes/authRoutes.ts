import { Router } from "express";
import { signUp , loginHandler, sendOtpHandler, verifyOtpHandler, refreshTokenHandler, logoutHandler, validateUser, resetPasswordOtpSendHandler, resetPasswordHandler, } from "../controllers/authController";
import passport from "passport";


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

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// Google OAuth callback
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login', // Redirect to login on failure
        successRedirect: '/home', // Redirect to home on success
    })
);

router.get('/logout', (req, res, next) => {
    try {
        req.logout(err => {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    } catch (err) {
        next(err);
    }
});





export default router;