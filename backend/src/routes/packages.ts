import express from 'express';
import { auth, isAdmin } from '../middleware/auth';
import { getPackages, createPackage, updatePackage, deletePackage } from '../controllers/packages';

const router = express.Router();

router.get('/', getPackages); 
router.post('/', auth, isAdmin, createPackage);
router.put('/:id', auth, isAdmin, updatePackage);
router.delete('/:id', auth, isAdmin, deletePackage);

export default router;