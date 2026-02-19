import { diskStorage } from "multer";

export const multerOptions = (destination: string) => ({
  storage: diskStorage({
    destination,
    filename: (req, file, cb) => {
      const ext = file.originalname.split('.').pop();
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});