//custom modules
import config from '@/config';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';

// models
import Token from '@/models/token';
import User from '@/models/user';

// types
import type { IUser } from '@/models/user';
import type { Request, Response } from 'express';

type UserData = Pick<IUser, 'email' | 'password'>

const login = async (req: Request, res: Response):Promise<void> => {
  try {
    const { email } = req.body as UserData;
    const user = await User.findOne({ email })
      .select('username email password role')
      .lean()
      .exec();
    if (!user) {
      res.status(404).json({
        code: "NotFound",
        message: "User not found."
      });
      return;
    }

    // generate access token and refresh for new user
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    // store the token to the Database
    await Token.create({ token: refreshToken, userId: user._id });
    logger.info('Refresh token created for user', {
      userId: user._id,
      token:refreshToken
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite:'strict'
    })

   res.status(201).json({
     user: {
       username: user.username,
       email: user.email,
       role:user.role
     },
     accessToken
   })
   
    logger.info('User register successful',user)
 } catch (error) {
   res.status(500).json({
     code:"ServerError",
     message: "Internal server Error.",
     error:error
   })
   logger.error('Error during user registration.',error)
 }
}
export default login;