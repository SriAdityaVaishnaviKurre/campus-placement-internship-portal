import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An internal server exception has occurred.';

  console.error('[API Error Handler]:', err.stack || err);

  res.status(statusCode).json({
    error: message,
    statusCode,
    timestamp: new Date().toISOString()
  });
};
