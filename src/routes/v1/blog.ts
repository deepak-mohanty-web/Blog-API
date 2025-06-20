//node modules
import { Router } from 'express';
import { body, param, query } from 'express-validator';
import multer from 'multer';
//middleware
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import uploadBlogBanner from '@/middlewares/uploadBlogBanner';
import validationError from '@/middlewares/validationError';
// controllers
import createBlogs from '@/controllers/v1/blogs/create_blog.';
import getAllBlogs from '@/controllers/v1/blogs/get_all_blog';
import getBlogsByUser from '@/controllers/v1/blogs/get_blogs_by_user';
import getBlogsBySlug from '@/controllers/v1/blogs/get_blogs_by_slug';

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
);
router.get(
  '/',
  authenticate,
  authorize(['admin','user']),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be in between 1 to 50"),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage("Offset must be a positive integer"),
  validationError,
  getAllBlogs
);
router.get(
  '/user/:userId',
  authenticate,
  authorize(['admin', 'user']),
  param('userId')
    .isMongoId()
    .withMessage("Invalid user ID"),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be in between 1 to 50"),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage("Offset must be a positive integer"),
  validationError,
  getBlogsByUser
);
router.get(
  '/:slug',
  authenticate,
  authorize(['admin', 'user']),
  param('slug').notEmpty().withMessage("Slug is required"),
  getBlogsBySlug
)
export default router;