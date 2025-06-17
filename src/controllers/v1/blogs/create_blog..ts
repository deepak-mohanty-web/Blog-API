// node modules
import  DOMPurify  from 'dompurify';
import { JSDOM } from 'jsdom';

// custom modules
import { logger } from '@/lib/winston';

// models
import Blog from '@/models/blog'; 
// types
import type { Request, Response } from 'express';
import { IBlog } from '@/models/blog';

type BlogData = Pick<IBlog, 'title' | 'content'|'banner' | 'status'>

// Purify the blog content
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const createBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, banner, status } = req.body as BlogData;
    const userId = req.userId;

    const cleanContent = purify.sanitize(content);

    const newBlog = await Blog.create({
      title,
      content: cleanContent,
      banner,
      status,
      author: userId
    });
    logger.info("New blog created", newBlog);
    res.status(200).json({
      newBlog
    });
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error
    });
    logger.error("Error while blog creation", error);
  }
}
export default createBlogs;