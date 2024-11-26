import { Request, Response, Router } from "express";
import { signUp , loginHandler, sendOtpHandler, verifyOtpHandler, refreshTokenHandler, logoutHandler, validateUser, resetPasswordOtpSendHandler, resetPasswordHandler, googleLoginSuccess, googleLoginFailure, } from "../controllers/authController";
import passport from "passport";
import { googleLogin } from "../controllers/googleAuthLibrary";



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


// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// interface AuthenticatedRequest extends Request {
//     user?: {
//         id: string;
//         firstName: string;
//         lastName: string;
//         email: string;
//         role: string;
//     };
// }
// const handleGoogleLoginSuccess = (req: Request, res: Response) => {
//     googleLoginSuccess(req as AuthenticatedRequest, res); // Cast req to AuthenticatedRequest
//   };
// // Google OAuth callback
// router.get('/google/callback',
//     passport.authenticate('google', {
//       failureRedirect: '/login', // Redirect to login on failure
//       successRedirect: '/home', // Redirect to home on success
//     }), handleGoogleLoginSuccess);

// // Failure route
// router.get('/google/failure', googleLoginFailure);

// router.get('/logout', (req, res, next) => {
//     try {
//         req.logout(err => {
//             if (err) {
//                 return next(err);
//             }
//             res.redirect('/');
//         });
//     } catch (err) {
//         next(err);
//     }
// });







export default router;