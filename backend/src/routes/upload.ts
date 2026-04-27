import express from 'express';
import { uploadCloud } from '../utils/cloudinary';

const router = express.Router();

router.post('/', uploadCloud.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  res.json({ url: req.file.path });
});

export default router;