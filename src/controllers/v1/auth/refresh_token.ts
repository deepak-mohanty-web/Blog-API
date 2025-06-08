// node module
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

//custom modules
import { generateAccessToken, verifyRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';

// models
import Token from '@/models/token';

//types
import type { Request, Response } from 'express';
import { Types } from 'mongoose';

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string;

  try {
    const tokenExist = await Token.exists({ token: refreshToken });
    if (!tokenExist) {
      res.status(401).json({
        code: "AuthenticationError",
        message: "Invalid refresh token"
      });
      return;
    }
    // verify the refresh token 
    const jwtPayload = verifyRefreshToken(refreshToken) as { userId: Types.ObjectId };
    
    const accessToken = generateAccessToken(jwtPayload.userId)
    res.status(200).json({
      accessToken
    })
    
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: "AuthenticationError",
        message: "Refresh token expired,please login again"
      });
      return;
    }
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: "AuthenticationError",
        message: "Invalid refresh token"
      });
      return;
    }
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error,
    });
    logger.error("Error during refresh the token",error)
  }
};

export default refreshToken;