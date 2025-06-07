//node modules
import jwt from 'jsonwebtoken';
//custom modules
import config from '@/config';
// types
import { Types } from 'mongoose';

export const generateAccessToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, config.JWT_ACCESS_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY,
    subject: 'accessApi'
  });
};
export const generateRefreshToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRY,
    subject:'refreshToken'
  });
}