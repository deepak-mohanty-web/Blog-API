// node module
import { Router } from 'express';
const router = Router();
//routes
import authRoutes from '@/routes/v1/auth';
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

export default router;