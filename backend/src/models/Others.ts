import mongoose, { Schema } from 'mongoose';
import { ICategory, IIssue, IPackage, IUserPackage } from './interfaces';

// Category
const CategorySchema = new Schema({ category_name: { type: String, required: true } });
export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);


// Package
const PackageSchema = new Schema({
  package_name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  package_detail: String
});
export const Package = mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema);

// UserPackage
const UserPackageSchema = new Schema({
  start_date: { type: Date, default: Date.now },
  end_date: { type: Date, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  package_id: { type: Schema.Types.ObjectId, ref: 'Package' }
});
export const UserPackage = mongoose.models.UserPackage || mongoose.model<IUserPackage>('UserPackage', UserPackageSchema);

// Issue
const IssueSchema = new Schema({
  issueId: { type: String },
  title: { type: String, required: true },
  description: String,
  category: String,
  status: { type: String, default: 'pending' },
  report_date: { type: Date, default: Date.now },
  note: String,
  user_id: { type: Schema.Types.ObjectId, ref: 'User' }
});
export const Issue = mongoose.models.Issue || mongoose.model<IIssue>('Issue', IssueSchema);