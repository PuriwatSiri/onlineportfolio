import { Request, Response } from 'express';
import { Payment } from '../models';
import User from '../models/User';

export const createPayment = async (req: Request, res: Response) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');

  const count = await Payment.countDocuments({});
  const sequence = String(count + 1).padStart(4, '0');
  const customPaymentId = `${year}${month}${day}${hours}${mins}${sequence}`;
  try {
    const user = (req as any).user;
    const payment = await Payment.create({
      ...req.body,
      user_id: user.id,
      paymentId: customPaymentId,
      payment_slip: req.body.payment_slip || 'slip_placeholder.jpg'
    });
    res.status(201).json(payment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error creating payment' });
  }
};

export const getPayments = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find()
      .populate('user_id', 'firstname lastname email')
      .populate('package_id', 'package_name')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching payments' });
  }
};

export const getMyPayments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const payments = await Payment.find({ user_id: userId })
      .populate('package_id', 'package_name')
      .sort({ created_at: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user payments' });
  }
};

export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Error updating payment' });
  }
};


export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const payment: any = await Payment.findById(req.params.id)
      .populate('package_id', 'package_name');
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    if (userRole !== 'admin' && payment.user_id.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching payment' });
  }
};


export const approvePayment = async (req: Request, res: Response) => {
  try {

    const payment: any = await Payment.findById(req.params.id).populate('package_id');

    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (payment.status === 'approved') return res.status(400).json({ message: 'Payment already approved' });


    payment.status = 'approved';
    await payment.save();

    const userId = payment.user_id || payment.user;
    const user: any = await User.findById(userId);

    const durationDays = payment.package_id?.duration || 30;

    if (user) {
      const currentDate = new Date();
      const baseDate = (user.packageExpire && new Date(user.packageExpire) > currentDate)
        ? new Date(user.packageExpire)
        : currentDate;


      baseDate.setDate(baseDate.getDate() + durationDays);
      user.packageExpire = baseDate;

      if (payment.package_id) {
        user.packageId = payment.package_id._id || payment.package_id;
      }
      await user.save();
    }

    res.json({ message: 'Payment approved and package extended', payment });
  } catch (error: any) {
    res.status(500).json({ error: 'Error approving payment' });
  }
};