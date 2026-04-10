import express from 'express';
import { AuthControllar } from './auth.controllar';
import { USER_ROLE } from '../user/user.constent';
import auth from '../../middleware/auth';

const router = express.Router();

// --- Authentication & Session ---
router.post('/login', AuthControllar.loginControllar);

router.post('/login-dashboard', AuthControllar.DashboardloginControllar);

router.post('/refresh-token', AuthControllar.refreshTokenControllar);

router.post('/logout', AuthControllar.logoutControllar);

// --- Password Recovery (OTP Flow) ---
// 1. Request OTP
router.post('/forgot-password', AuthControllar.forgetPasswordControllar);

// 2. Resend OTP if not received
router.post('/resend-otp', AuthControllar.resendOtpControllar);

// 3. Verify the OTP to get reset token
router.post('/verify-otp', AuthControllar.verifyOtpControllar);

// 4. Set the new password using the reset token
router.post('/reset-password', AuthControllar.setNewPasswordControllar);

// --- Authenticated Routes ---

// Get current user profile
router.get(
  '/me',
  auth(USER_ROLE.ADMIN,USER_ROLE.MANAGER,USER_ROLE.SUPER_ADMIN , USER_ROLE.DEVELOPER, USER_ROLE.STAFF , USER_ROLE.USER),
  AuthControllar.getMe,
);

// User changes their own password
router.patch(
  '/change-password',
  auth(USER_ROLE.ADMIN,USER_ROLE.MANAGER,USER_ROLE.SUPER_ADMIN , USER_ROLE.DEVELOPER, USER_ROLE.STAFF , USER_ROLE.USER),
  AuthControllar.ChangePasswordControllar,
);

// Admin/Super-Admin changes another user's password from dashboard
router.patch(
  '/change-password/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  AuthControllar.fromDashbaordChangePasswordControllar,
);

export const AuthRouter = router;