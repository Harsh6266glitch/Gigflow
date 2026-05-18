import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';

export const authorize =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      const error: AppError = new Error('Not authenticated');
      error.statusCode = 401;
      return next(error);
    }

    if (!roles.includes(req.user.role)) {
      const error: AppError = new Error(
        `Role '${req.user.role}' is not authorized to access this route`
      );
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
