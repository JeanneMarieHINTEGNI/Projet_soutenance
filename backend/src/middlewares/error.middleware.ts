import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  res.status(500).json({
    status: 'error',
    message: 'Une erreur est survenue',
  });
}; 