import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/ApiResponse';
import logger from '../utils/logger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    logger.warn(`Operational Error: ${err.message}`);
    return ApiResponse.error(res, err.message, err.statusCode);
  }

  let logMessage = err.message;
  let logStack = err.stack;

  // Sanitize sensitive info from logs in production
  if (process.env.NODE_ENV === 'production') {
    const sensitivePatterns = [
      /postgres:\/\/.*@/g,
      /mongodb(?:\+srv)?:\/\/.*@/g,
      /Bearer [A-Za-z0-9\-\._~\+\/]+/gi,
      /(eyJ[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,})/gi // JWTs
    ];

    for (const pattern of sensitivePatterns) {
      if (logMessage) logMessage = logMessage.replace(pattern, '***REDACTED***');
      if (logStack) logStack = logStack.replace(pattern, '***REDACTED***');
    }
  }

  // Log unexpected errors
  logger.error(`Unexpected Error: ${logMessage}`, { stack: logStack });

  // Do not leak error details to the client in production
  const responseMessage = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
  const responseDetails = process.env.NODE_ENV === 'production' ? undefined : err.stack;

  return ApiResponse.error(res, responseMessage, 500, responseDetails);
};
