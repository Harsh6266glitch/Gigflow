import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { AppError } from './error.middleware';

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token as string;
    }

    if (!token) {
      const error: AppError = new Error('Not authorized, no token provided');
      error.statusCode = 401;
      return next(error);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      const error: AppError = new Error('User not found');
      error.statusCode = 401;
      return next(error);
    }

    req.user = user;
    next();
  } catch {
    const error: AppError = new Error('Not authorized, token invalid');
    error.statusCode = 401;
    next(error);
  }
};
