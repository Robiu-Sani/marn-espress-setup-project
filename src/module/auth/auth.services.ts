/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../../config';
import { ApiError } from '../../utils/apiError';
import User from '../user/user.model';
import { OTP } from './otp.model';
import EmailTemplates from '../../utils/sendEmail';
import { IAuth } from './auth.interface';

// --- Helper: Generate Tokens ---
const generateToken = (payload: any, secret: string, expiresIn: string) => {
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

// --- Core Login Logic ---
const loginUser = async (payload: IAuth, isDashboard: boolean = false) => {
  const { email: userEmail, password } = payload;

  const user = await User.findOne({ email: userEmail }).select('+password');
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  if (user.isDeleted) throw new ApiError(httpStatus.FORBIDDEN, 'Account deleted');
  if (user.status === 'blocked') throw new ApiError(httpStatus.FORBIDDEN, 'Account blocked');

  // Dashboard Restriction
  if (isDashboard && !['admin', 'super-admin'].includes(user.role)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Access denied. Admins only.');
  }

  const isMatch = await bcrypt.compare(password, user.password as string);
  if (!isMatch) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');

  const jwtPayload = { _id: user._id, email: user.email, role: user.role };

  const access_token = generateToken(jwtPayload, config.jwt_access_secret, config.expire_access_in);
  const refresh_token = generateToken(jwtPayload, config.jwt_refresh_secret, config.expire_refresh_in);

  const userWithoutPassword = user.toObject();
  delete (userWithoutPassword as any).password;

  return { user: userWithoutPassword, access_token, refresh_token };
};

// --- Password Management ---
const changePassword = async (payload: { oldPassword: string; newPassword: string }, user: JwtPayload) => {
  const { oldPassword, newPassword } = payload;

  const getUser = await User.findById(user._id).select('+password');
  if (!getUser) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  const isMatch = await bcrypt.compare(oldPassword, getUser.password as string);
  if (!isMatch) throw new ApiError(httpStatus.UNAUTHORIZED, 'Old password incorrect');

  getUser.password = newPassword;
  getUser.isNewUser = false;
  await getUser.save();

  return { message: 'Password updated successfully' };
};

// --- OTP & Reset Logic ---
const forgetPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Save OTP (TTL will handle deletion)
  await OTP.findOneAndUpdate(
    { email },
    { otp: otpCode, createdAt: new Date() },
    { upsert: true, new: true }
  );

  await EmailTemplates.sendOtpEmail(email, otpCode, user.name);
  return { message: 'OTP sent to your email' };
};

const verifyOtp = async (email: string, otp: string) => {
  const otpRecord = await OTP.findOne({ email, otp });
  if (!otpRecord) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP');

  // Generate a temporary reset token
  const resetToken = jwt.sign({ email }, config.jwt_forget_password_secret, {
    expiresIn: config.expire_forget_password_in,
  } as jwt.SignOptions);

  await OTP.deleteOne({ _id: otpRecord._id });
  return { resetToken };
};

const resetPassword = async (token: string, newPassword: string) => {
  const decoded = jwt.verify(token, config.jwt_forget_password_secret) as JwtPayload;
  
  const user = await User.findOne({ email: decoded.email });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  user.password = newPassword;
  await user.save();

  return { message: 'Password reset successfully' };
};

const refreshToken = async (token: string) => {
  const decoded = jwt.verify(token, config.jwt_refresh_secret) as JwtPayload;
  const user = await User.findById(decoded._id);
  
  if (!user || user.isDeleted || user.status === 'blocked') {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid session');
  }

  const newAccessToken = generateToken(
    { _id: user._id, email: user.email, role: user.role },
    config.jwt_access_secret,
    config.expire_access_in
  );

  return { access_token: newAccessToken };
};

const itsMe = async (user: JwtPayload) => {
  const result = await User.findById(user._id);
  if (!result || result.isDeleted) throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
  return result;
};

/**
 * Resend OTP to the user's email
 * This resets the 10-minute expiration timer
 */
const resendOtp = async (email: string) => {
  // 1. Verify the user exists
  const user = await User.findOne({ email, isDeleted: false });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No account found with this email address');
  }

  // 2. Security check: Ensure the user isn't blocked
  if (user.status === 'blocked') {
    throw new ApiError(httpStatus.FORBIDDEN, 'This account is blocked');
  }

  // 3. Generate a new 6-digit OTP
  const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // 4. Update the OTP record
  // findOneAndUpdate with { upsert: true } handles both first-time and repeated requests.
  // Setting createdAt to Date.now() resets the 10-minute TTL countdown in MongoDB.
  await OTP.findOneAndUpdate(
    { email },
    { 
      otp: newOtpCode, 
      createdAt: new Date() 
    },
    { upsert: true, new: true }
  );

  // 5. Send the email
  await EmailTemplates.sendOtpEmail(email, newOtpCode, user.name);

  return { message: 'A new verification code has been sent to your email.' };
};


export const AuthServices = {
  loginUser,
  changePassword,
  forgetPassword,
  verifyOtp,
  resetPassword,
  refreshToken,
  itsMe,
  resendOtp
};