export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true, stack = '') {
    super(message);

    this.statusCode = statusCode;
    // isOperational identifies if the error is a predicted functional error
    // vs a technical programming bug/crash.
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Utility to check if an error is an instance of AppError
 */
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};