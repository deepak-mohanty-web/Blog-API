// custom module
import { logger } from '@/lib/winston';

// models
import User from '@/models/user';

// types
import type { Request, Response } from 'express';

const getCurrentUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).select('-__v').lean().exec();
    res.status(200).json({
      user
    })
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error
    });
    logger.error("Error during getting the current user",error)
  }
}
export default getCurrentUser;