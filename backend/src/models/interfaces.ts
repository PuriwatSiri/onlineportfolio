import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  deleted: boolean;
  suspended: boolean;
  packageExpire?: Date | null;
  packageId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory extends Document {
  category_name: string;
}

export interface ITemplate extends Document {
  template_name: string;
  release_date: Date;
  preview_image: string;
  category_id: Types.ObjectId;
}

export interface IPortfolio extends Document {
  title: string;
  is_public: boolean;
  cover_image: string;
  create_date: Date;
  user_id: Types.ObjectId;
  category_id: Types.ObjectId;
  template_id: Types.ObjectId;  

export interface IUpload extends Document {
  file_path: string;
  file_type: string;
  upload_date: Date;
  user_id: Types.ObjectId;
  portfolio_id: Types.ObjectId;
}

export interface IIssue extends Document {
  issueId?: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  report_date: Date;
  note?: string;
  user_id: Types.ObjectId;
}

export interface IPackage extends Document {
  package_name: string;
  price: number;
  duration: number;
  package_detail: string;
}

export interface IPromotion extends Document {
  promotion_name: string;
  description: string;
  discount_type: 'percent' | 'amount';
  discount_value: number;
  start_date: Date;
  end_date: Date;
  active: boolean;
}

export interface IUserPackage extends Document {
  start_date: Date;
  end_date: Date;
  user_id: Types.ObjectId;
  package_id: Types.ObjectId;
}

export interface IPayment extends Document {
  amount: number;
  transfer_time: Date;
  payment_slip: string;
  created_at: Date;
  status: 'pending' | 'approved' | 'rejected';

  user_id: Types.ObjectId;
  package_id: Types.ObjectId;

  approved_by?: Types.ObjectId;
  approve_date?: Date;
}

export interface IPasswordReset extends Document {
  reset_token: string;
  request_date: Date;
  expiry_date: Date;
  user_id: Types.ObjectId;
}