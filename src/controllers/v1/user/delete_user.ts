// custom modules
import { logger } from '@/lib/winston';

// model
import User from '@/models/user';

// types
import type { Request, Response } from 'express';

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId;
  try {
    const user = await User.deleteOne({_id:userId}).select('-__v').exec();
    if (!user) {
      res.status(404).json({
        code: "NotFound",
        message: "User not found"
      });
      return;
    }
    res.sendStatus(204)
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error
    });
    logger.error("Error while delete the user", error)
  }
};
export default deleteUser;