import mongoose, { Schema } from 'mongoose';
import { IUser } from './interfaces';

const UserSchema: Schema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  deleted: { type: Boolean, default: false },
  packageExpire: { type: Date, default: null }, // ✅ เพิ่มวันหมดอายุ
  packageId: { type: Schema.Types.ObjectId, ref: 'Package', default: null }, // track current package
  status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' }
}, { timestamps: true });
export default mongoose.model<IUser>('User', UserSchema);