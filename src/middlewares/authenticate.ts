// node module
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

// custom module
import { verifyAccessToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';

// types
import type { Request, Response, NextFunction } from 'express';
import type { Types } from 'mongoose'; 

// function authenticate - Middleware to verify the user's access token from the Authentication header. If the token is valid, the user's ID is attached to the request object. Otherwise, it return an appropriate error response.

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  // if there's no bearer token, respond with 401 unauthorized
  if (!authHeader?.startsWith('Bearer')) {
    res.send(401).json({
      code: "AuthenticationError",
      message: "Access denied, no token provided"
    });
    return;
  }
  // split out the token from the Bearer prefix
  const [_, token] = authHeader.split(' ');
  try {
    // Verify the token and extract the userId from the payload
    const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };
    // attach the userId to request object for later used
    req.userId = jwtPayload.userId;

    // proceed to the next middleware
    return next();
  } catch (error) {
    // Handle the expire token error
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: "AuthenticationError",
        message:"Access token expired, request a new one with refresh token"
      })
    }

    // Handle the invalid token error
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: "AuthenticationError",
        message:"Access token invalid"
      })
    }

    // catch all for other error
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error:error
    })
   logger.error("Error during authentication",error)
  }
};
export default authenticate;