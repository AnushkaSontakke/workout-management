import { Request, Response } from 'express';
import {
  registerUserService,
  resetPasswordService,
} from '../services/user.service';
import { loginUserService } from '../services/user.service';
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, passKey } = req.body;

    if (!firstName || !lastName || !email || !password || !passKey) {
      return res.status(400).json({
        success: false,
        message: 'Email and Password are required',
      });
    }

    const user = await registerUserService({
      firstName,
      lastName,
      email,
      password,
      passKey,
    });

    return res.status(201).json({
      success: true,
      message: 'Registration completed successfully!',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message === 'Email already registered'
    ) {
      return res.status(409).json({
        success: false,
        message: 'This email address is already registered.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Something went wrong while registering the user.',
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const result = await loginUserService({ email, password });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error: unknown) {
    console.error('LOGIN ERROR:', error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, passKey, newPassword } = req.body;

    if (
      typeof email !== 'string' ||
      typeof passKey !== 'string' ||
      typeof newPassword !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Email, passKey and new password are required',
      });
    }

    const result = await resetPasswordService({
      email,
      passKey,
      newPassword,
    });

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Password reset failed',
    });
  }
};
