/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import Jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { ApiError } from '../utils/apiError';
import httpStatus from 'http-status';
import { TUserRole } from '../module/user/user.interface';
import User from '../module/user/user.model';
import catchAsync from '../utils/catchAsync';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Extract token from Cookies or Authorization Header
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.accessToken;

    let token: string | undefined;

    if (cookieToken) {
      // Priority 1: Check Cookies
      token = cookieToken;
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      // Priority 2: Check Authorization Header
      token = authHeader.split(' ')[1];
    }

    // If no token is found in either place
    if (!token) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized. Please login to access this resource.',
      );
    }

    let decoded: JwtPayload;

    try {
      // 2. Verify Token
      decoded = Jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;

      const { _id, role } = decoded;

      // 3. Check if User exists in Database
      const user = await User.findById(_id);
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'This user does not exist');
      }

      // 4. Check if Account is Deleted
      if (user.isDeleted) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          'This account has been deleted.',
        );
      }

      // 5. Check if Account is Blocked
      if (user.status === 'blocked') {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          'Your account has been blocked by an administrator.',
        );
      }

      // 6. Role-Based Authorization
      // If specific roles are required, check if user's role matches
      if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          'You do not have the required permissions to access this resource.',
        );
      }

      // 7. Attach Decoded User to Request Object
      req.user = decoded;
      next();
    } catch (err: any) {
      // Handle Specific JWT Errors
      if (err.name === 'TokenExpiredError') {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'Session expired. Please login again.',
        );
      } else if (err.name === 'JsonWebTokenError') {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'Invalid session. Please provide a valid token.',
        );
      } else {
        // Handle unexpected errors (like User DB check failing)
        throw new ApiError(
          err.statusCode || httpStatus.UNAUTHORIZED,
          err.message || 'Authentication failed.',
        );
      }
    }
  });
};

export default auth;