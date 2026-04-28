import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateProfile
} from '../controllers/users';

import { forgotPassword, resetPassword } from '../controllers/password';

import { auth, isAdmin } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', auth, getCurrentUser);
router.use(auth, isAdmin);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.put('/profile/:id', updateProfile);

export default router;