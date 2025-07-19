import express from 'express';
import { cloudinary } from '../config/cloudinary.js';
import { authMiddleware } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

router.get(
  '/upload-signature',
  authMiddleware,
  (req, res) => {
    // Cloudinary requires a timestamp for the signature
    const timestamp = Math.round(Date.now() / 1000);
    // Optionally you can also sign other params, e.g. folder: 'auctions'
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: 'auctions' },
      process.env.CLOUDINARY_API_SECRET
    );
    res.json({
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder: 'auctions'            // send back so frontend can reuse
    });
  }
);

export default router;
