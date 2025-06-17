// node module
import { Router } from 'express';
const router = Router();
//routes
import authRoutes from '@/routes/v1/auth';
import userRoutes from '@/routes/v1/user'
import blogRoutes from '@/routes/v1/blog'
// root routes
router.get('/', (req, res) => {
  res.status(200).json({
    message: "API is live",
    status: 'ok',
    version: "1.0.0",
    docs: "https://docs.blog-api.deepak.com",
    timeStamp:new Date().toISOString(),
  })
})

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/blogs',blogRoutes)

export default router;