import jwt from 'jsonwebtoken';
import { error } from 'node:console';
export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT secret is not configured');
  }
  return jwt.sign({ userId }, secret, { expiresIn: '1d' });
};
