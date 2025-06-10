//node modules
import { Router } from 'express';
import { body } from 'express-validator';
//middleware
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
//controller
import getCurrentUser from '@/controllers/v1/user/get_current_user';
import updateCurrentUser from '@/controllers/v1/user/update_current_user';
import deleteCurrentUser from '@/controllers/v1/user/delete_current_user';
// model
import User from '@/models/user';
// custom modules
import validationError from '@/middlewares/validationError';




const router = Router();
router.get(
  '/current',
  authenticate,
  authorize(['admin', "user"]),
  getCurrentUser
);
router.put(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  body('username')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Username must be less than 20 characters")
    .custom(async (value) => {
      const existUser = await User.exists({ username: value });
      if (existUser) {
        throw Error("This username is already in use");
      }
    })
  ,
  body('email')
    .optional()
    .isLength({ max: 50 })
    .withMessage("Email must be less than 50 characters")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (value) => {
      const userExist = await User.exists({ email: value });
      if (userExist) {
        throw Error("This email is already used")
      }
    }
    ),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be 8 characters long"),
  body('firstName')
    .optional()
    .isLength({ max: 20 })
    .withMessage("First name must be less than 20 characters"),
    body('lastName')
    .optional()
    .isLength({ max: 20 })
    .withMessage("Last name must be less than 20 characters"),
  body(['website', 'facebook', 'instagram', 'linkedin', 'x', 'youtube'])
    .optional()
    .isLength({ max: 100 })
    .withMessage("Url must be less than 100 characters")
    .isURL()
    .withMessage("Invalid URL"),


  validationError,
  updateCurrentUser
)
router.delete(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  deleteCurrentUser
)
export default router;