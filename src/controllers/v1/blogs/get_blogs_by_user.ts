  // custom modules
  import config from '@/config';
import { logger } from '@/lib/winston';
import mongoose from 'mongoose';
  // models
  import Blog from '@/models/blog';
import User from '@/models/user';

  // type   
  import type { Request, Response } from 'express';

  interface QueryType  {
    status?:'draft'|'published'
  }

  const getBlogsByUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      const currentUserId = req.userId;
      const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
      const offset = parseInt(req.query.offset as string) || config.defaultResOffset;
  
      const currentUser = await User.findById(currentUserId).select('role').lean().exec();
      if (!currentUser) {
        logger.error('Sending 401 - unauthorized');
        res.status(401).json({
          code: "unauthorized",
          message: "User not authorized"
        });
        return;
      }
  
      console.log("🧾 Current User Role:", currentUser.role);
  
      const query: QueryType = {};
      if (currentUser?.role === 'user') {
        query.status = 'published';
      }
  
      const finalQuery = { author: userId, ...query };
      console.log("🔍 Final Mongo Query:", finalQuery);
  
      // DEBUG: Check blog statuses for this user
      const allUserBlogs = await Blog.find({ author: new mongoose.Types.ObjectId(userId) })
        .select('title status createdAt')
        .lean()
        .exec();
      
      console.log("📊 All blogs for user (with status):", allUserBlogs);
      console.log("📈 Blog status breakdown:", {
        total: allUserBlogs.length,
        published: allUserBlogs.filter(blog => blog.status === 'published').length,
        draft: allUserBlogs.filter(blog => blog.status === 'draft').length,
        other: allUserBlogs.filter(blog => blog.status !== 'published' && blog.status !== 'draft').length
      });
  
      const total = await Blog.countDocuments(finalQuery);
      const blogs = await Blog.find(finalQuery)
        .select('-banner.publicId')
        .populate('author', '-createdAt -updatedAt -__v')
        .limit(limit)
        .skip(offset)
        .sort({ createdAt: -1 })
        .lean()
        .exec();
  
      res.status(200).json({
        limit,
        offset,
        total,
        blogs,
      });
    } catch (error) {
      logger.error("Error while fetching the blogs by user", error);
      res.status(500).json({
        code: "ServerError",
        message: "Internal server error",
        error: error
      });
    }
  };

  export default getBlogsByUser;