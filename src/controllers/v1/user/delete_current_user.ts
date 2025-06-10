// custom module
import { logger } from '@/lib/winston';

// model
import User from '@/models/user';

// type
import type { Request, Response } from 'express';

const deleteCurrentUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  try {
    await User.deleteOne({ _id: userId });
    logger.info("User deleted successful", {
      userId
    });
    res.sendStatus(204)
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error
    });
    logger.error("Error during delete the user",error)
  }
}
export default deleteCurrentUser;