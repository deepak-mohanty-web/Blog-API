// node modules
import bcrypt from 'bcrypt';
import { Router } from 'express';
import { body } from 'express-validator';
//controllers
import login from '@/controllers/v1/auth/login';
import register from '@/controllers/v1/auth/register';
//middleware
import validationError from '@/middlewares/validationError';

//models
import User from '@/models/user';

const router = Router();

router.post('/register',
  body('email')
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isLength({ max: 50 })
    .withMessage("Email must be less than 50 characters")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (value) => {
      const existUser = await User.exists({ email: value });
      if (existUser) {
        throw new Error("User email and password is invalid");
        
      }
  })
  ,
  body('password')
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
  ,
  body('role')
    .optional()
    .isString()
    .withMessage('Role must be a string')
    .isIn(['admin', 'user'])
    .withMessage("Role must be either admin or user"),

  validationError,
  register);
router.post(
  '/login',
  body('email')
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isLength({ max: 50 })
    .withMessage("Email must be less than 50 characters")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (value) => {
      const existUser = await User.exists({ email: value });
      if (!existUser) {
        throw new Error("User email and password is invalid");
        
      }
    })
  ,
  body('password')
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .custom(async (value, { req }) => {
      const { email } = req.body as { email: string };
      const user = await User.findOne({ email })
        .select('password')
        .lean()
        .exec();
      if (!user) {
        throw new Error('User email and password is invalid')
      }

      const isMatch = await bcrypt.compare(value, user.password);
      if (!isMatch) {
        throw new Error('User email and password is invalid')
      }

    })
  ,
  validationError,
  login
);

export default router;