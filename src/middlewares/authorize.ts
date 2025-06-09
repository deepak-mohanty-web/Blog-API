// custom modules
import { logger } from '@/lib/winston';

// models
import User from '@/models/user';

// types
import type { Request, Response, NextFunction } from 'express';


export type AuthRole = 'admin' | 'user';

const authorize = (role: AuthRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    try {
      const user = await User.findById(userId).select('role').exec();
      if (!user) {
        res.status(404).json({
          code: "NotFound",
          message: "User not found"
        });
        return;
      }
      if (!role.includes(user.role)) {
        res.status(403).json({
          code: "AuthorizationError",
          message: "Access denied, insufficient permission"
        });
        return;
      }
      return next();
    } catch (error) {
      res.status(500).json({
        code: "ServerError",
        message: "Internal server error",
        error: error
      });
      logger.error("Error during authorization",error)
    }
 }
}

export default authorize;