import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.services';

// Helper for cookie options
const cookieOptions = {
  secure: config.node_env === 'production',
  httpOnly: true,
  sameSite: 'none' as const, 
};

// 1. Standard User Login
const loginControllar = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body, false);
  const { access_token, refresh_token, user } = result;

  res.cookie('refreshToken', refresh_token, cookieOptions);
  res.cookie('accessToken', access_token, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: { token: access_token, refreshToken: refresh_token, user },
  });
});

// 2. Admin/Dashboard Login
const DashboardloginControllar = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body, true);
  const { access_token, refresh_token, user } = result;

  res.cookie('refreshToken', refresh_token, cookieOptions);
  res.cookie('accessToken', access_token, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin logged in successfully',
    data: { token: access_token, refreshToken: refresh_token, user },
  });
});

// 3. OTP & Forget Password Flow
const forgetPasswordControllar = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.forgetPassword(req.body.email);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Verification code sent to email',
    data: result,
  });
});

const resendOtpControllar = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.resendOtp(req.body.email);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New verification code sent',
    data: result,
  });
});

const verifyOtpControllar = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const result = await AuthServices.verifyOtp(email, otp);

  // Set reset token in cookie for security during the reset process
  res.cookie('resetToken', result.resetToken, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP verified successfully',
    data: result,
  });
});

const setNewPasswordControllar = catchAsync(async (req: Request, res: Response) => {
  const resetToken = req.cookies.resetToken || req.headers.authorization;
  const { newPassword } = req.body;

  const result = await AuthServices.resetPassword(resetToken, newPassword);
  
  res.clearCookie('resetToken', cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successful',
    data: result,
  });
});

// 4. Password Updates
const ChangePasswordControllar = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.changePassword(req.body, req.user as JwtPayload);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password updated successfully',
    data: result,
  });
});

const fromDashbaordChangePasswordControllar = catchAsync(async (req: Request, res: Response) => {
  // Logic to allow admin to change a user's password directly
  const result = await AuthServices.resetPassword(req.params.id, req.body.newPassword);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User password updated by Admin',
    data: result,
  });
});

// 5. Token Management
const refreshTokenControllar = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken || req.headers.authorization;
  const result = await AuthServices.refreshToken(token);

  res.cookie('accessToken', result.access_token, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token refreshed',
    data: result,
  });
});

// 6. User Profile
const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.itsMe(req.user as JwtPayload);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

// 7. Logout
const logoutControllar = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie('refreshToken', cookieOptions);
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('resetToken', cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged out successfully',
    data: null,
  });
});

export const AuthControllar = {
  loginControllar,
  DashboardloginControllar,
  forgetPasswordControllar,
  resendOtpControllar,
  verifyOtpControllar,
  setNewPasswordControllar,
  ChangePasswordControllar,
  fromDashbaordChangePasswordControllar,
  refreshTokenControllar,
  getMe,
  logoutControllar,
};