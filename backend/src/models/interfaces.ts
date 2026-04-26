import { Document, Types } from 'mongoose';

// 1. User (ผู้ใช้งาน)
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

// 2. Category (หมวดหมู่)
export interface ICategory extends Document {
  category_name: string;
}

// 3. Template (แม่แบบ)
export interface ITemplate extends Document {
  template_name: string;
  release_date: Date;
  preview_image: string;
  category_id: Types.ObjectId; // FK -> Category
}

// 4. Portfolio (ผลงาน)
export interface IPortfolio extends Document {
  title: string;
  is_public: boolean;
  cover_image: string;
  create_date: Date;
  user_id: Types.ObjectId;      // FK -> User
  category_id: Types.ObjectId;  // FK -> Category
  template_id: Types.ObjectId;  // FK -> Template
}

// 5. Uploads (ไฟล์อัปโหลด)
export interface IUpload extends Document {
  file_path: string;
  file_type: string;
  upload_date: Date;
  user_id: Types.ObjectId;
  portfolio_id: Types.ObjectId;
}

// 6. Issue (แจ้งปัญหา)
export interface IIssue extends Document {
  issueId?: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  report_date: Date;
  note?: string;
  user_id: Types.ObjectId;
}

// 7. Package (แพ็กเกจขาย)
export interface IPackage extends Document {
  package_name: string;
  price: number;
  duration: number; // จำนวนวัน
  package_detail: string;
}

// 8. Promotion (โปรโมชั่น)
export interface IPromotion extends Document {
  promotion_name: string;
  description: string;
  discount_type: 'percent' | 'amount';
  discount_value: number;
  start_date: Date;
  end_date: Date;
  active: boolean;
}

// 9. User_Package (ประวัติการซื้อ/ใช้งานแพ็กเกจ)
export interface IUserPackage extends Document {
  start_date: Date;
  end_date: Date;
  user_id: Types.ObjectId;
  package_id: Types.ObjectId;
}

// 10. Payment (การชำระเงิน + Approval)
// *หมายเหตุ: รวมตาราง Payment_Approval ไว้ในนี้เพื่อความสะดวก (Best Practice ของ MongoDB)
export interface IPayment extends Document {
  amount: number;
  transfer_time: Date;
  payment_slip: string;
  created_at: Date;
  status: 'pending' | 'approved' | 'rejected'; // สถานะการอนุมัติ
  
  // Foreign Keys
  user_id: Types.ObjectId;
  package_id: Types.ObjectId;

  // ส่วน Approval (Admin)
  approved_by?: Types.ObjectId;
  approve_date?: Date;
}

// 11. Password_Reset (รีเซรหัสผ่าน)
export interface IPasswordReset extends Document {
  reset_token: string;
  request_date: Date;
  expiry_date: Date;
  user_id: Types.ObjectId;
}