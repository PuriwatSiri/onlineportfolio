import express from 'express';
import { createPayment, getPayments, updatePaymentStatus, approvePayment, getMyPayments, getPaymentById } from '../controllers/payments';
import { auth, isAdmin } from '../middleware/auth';

const router = express.Router();

router.post('/', auth, createPayment);
// user's own payments
router.get('/me', auth, getMyPayments);
// GET single payment (owner or admin)
router.get('/:id', auth, getPaymentById);
router.get('/', auth, isAdmin, getPayments);
router.put('/:id', auth, isAdmin, updatePaymentStatus);
router.put('/:id/approve', auth, isAdmin, approvePayment); // ✅ ปุ่มกด Approve

export default router;