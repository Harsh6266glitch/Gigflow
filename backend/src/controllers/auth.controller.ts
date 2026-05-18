import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AppError } from '../middleware/error.middleware';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);
};

const setTokenCookie = (res: Response, token: string): void => {
  const expiresInMs = 7 * 24 * 60 * 60 * 1000; // 7 days
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: expiresInMs,
  });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role?: 'Admin' | 'Sales User';
    };

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(Object.assign(new Error('Email already registered'), { statusCode: 409 }) as AppError);
    }

    const user = await User.create({ name, email, password, role: role || 'Sales User' });
    const token = generateToken(user._id.toString());
    setTokenCookie(res, token);

    sendSuccess(
      res,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
      'Registration successful',
      201
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(Object.assign(new Error('Invalid email or password'), { statusCode: 401 }) as AppError);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(Object.assign(new Error('Invalid email or password'), { statusCode: 401 }) as AppError);
    }

    const token = generateToken(user._id.toString());
    setTokenCookie(res, token);

    sendSuccess(
      res,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
      'Login successful'
    );
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(Object.assign(new Error('Not authenticated'), { statusCode: 401 }) as AppError);
    }
    sendSuccess(res, req.user, 'User fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('token');
  sendSuccess(res, null, 'Logged out successfully');
};
