import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'tmp_uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log('[UPLOAD] Created tmp_uploads directory');
}

export const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random()*1e9)}`;
      cb(null, unique + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB max
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (!file.mimetype.startsWith('image/')) {
      console.warn(`[UPLOAD] Rejected file (not image): ${file.originalname}`);
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});
