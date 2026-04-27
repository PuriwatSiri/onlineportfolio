import mongoose, { Schema } from 'mongoose';
import { IPayment } from './interfaces';

const PaymentSchema: Schema = new Schema({
  amount: { type: Number, required: true },
  transfer_time: { type: Date, required: true },
  payment_slip: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  package_id: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
  paymentId: { type: String },
  approved_by: { type: Schema.Types.ObjectId, ref: 'User' },
  approve_date: { type: Date }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

export default mongoose.model<IPayment>('Payment', PaymentSchema);