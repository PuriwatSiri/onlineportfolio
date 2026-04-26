import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: 'dmx0dzxjh',
  api_key: '461474922177321',
  api_secret: 'yng2Mgci_0nhVCQo8A5Sc8_U71A'
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio-app',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  } as any,
});

export const uploadCloud = multer({ storage: storage });