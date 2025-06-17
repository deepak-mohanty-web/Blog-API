// node modules
import { v2 as cloudinary } from 'cloudinary';

// custom modules
import { logger } from '@/lib/winston';
import config from '@/config';

// types
import type { UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
  secure: config.NODE_ENV === 'production'
});

const uploadToCloudinary = (buffer: Buffer<ArrayBufferLike>, publicId?: string): Promise<UploadApiResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({
      allowed_formats: ['png', 'jpg', 'webp'],
      resource_type: 'image',
      folder: 'blog-api',
      public_id: publicId,
      transformation: { quality: 'auto' },
    }, (err, result) => {
      if (err) {
        logger.error('Error uploading image to cloudinary', err);
        reject(err);
      }
      resolve(result)
    }).end(buffer);
  })
};
export default uploadToCloudinary;