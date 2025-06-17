//node modules
import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
//middleware
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import uploadBlogBanner from '@/middlewares/uploadBlogBanner';
import validationError from '@/middlewares/validationError';
// controllers
import createBlogs from '@/controllers/v1/blogs/create_blog.';

const upload = multer();

const router = Router();
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  upload.single('banner_image'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 180 })
    .withMessage("Title must be less than 180 characters"),
  body('content')
    .trim()
    .notEmpty()
    .withMessage("Content is required"),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage("Status must be one of the value, draft or published"),
  validationError,
  uploadBlogBanner('post'),
  createBlogs
)
export default router;