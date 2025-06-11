// custom modules
import { logger } from '@/lib/winston';

// model
import User from '@/models/user';

// types
import type { Request, Response } from 'express';

const getUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId).select('-__v').exec();
    if (!user) {
      res.status(404).json({
        code: "NotFound",
        message: "User not found"
      });
      return;
    }
    res.status(200).json({
      user
    })
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error
    });
    logger.error("Error while get the user", error)
  }
};
export default getUser;