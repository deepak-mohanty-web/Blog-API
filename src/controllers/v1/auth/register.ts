// custom modules
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import { getUserName } from '@/utils';

//models
import Token from '@/models/token';
import User from '@/models/user';
//types
import config from '@/config';
import type { IUser } from '@/models/user';
import type { Request, Response } from 'express';


type UserData = Pick<IUser, 'email' | 'password' | 'role'>

 const register = async (req: Request, res: Response): Promise<void> => {
   const { email, password, role } = req.body as UserData;
   if (role === 'admin' && !config.WHITELIST_ADMIN_MAIL.includes(email)) {
     res.status(403).json({
       code: "AuthorizationError",
       message: "You cannot register as an admin"
     });
     logger.warn(
       `User with email ${email} tried to register as an admin but is not in the whitelist`
     );
     return;
   }
   try {
     const username = getUserName();
     const newUser = await User.create({
       username,
       email,
       password,
       role
     });

     // generate access token and refresh for new user
     const accessToken = generateAccessToken(newUser._id);
     const refreshToken = generateRefreshToken(newUser._id);
     // store the token to the Database
     await Token.create({ token: refreshToken, userId: newUser._id });
     logger.info('Refresh token created for user', {
       userId: newUser._id,
       token:refreshToken
     })

     res.cookie('refreshToken', refreshToken, {
       httpOnly: true,
       secure: config.NODE_ENV === 'production',
       sameSite:'strict'
     })

    res.status(201).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        role:newUser.role
      },
      accessToken
    })
    
     logger.info('User register successful')
  } catch (error) {
    res.status(500).json({
      code:"ServerError",
      message: "Internal server Error.",
      error:error
    })
    logger.error('Error during user registration.',error)
  }
}
export default register;