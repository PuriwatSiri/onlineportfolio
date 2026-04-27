import mongoose, { Schema, Document } from 'mongoose';

export interface ITemplate extends Document {
  name: string;
  thumbnail: string;
  preview?: string;
  elements: any[];
  pages: any[][];
  page_backgrounds: string[];
  category: string;
  active: boolean;
  created_by?: mongoose.Types.ObjectId;
  releaseDate?: Date;
  backgroundColor?: string;
  usageCount: number;
}

const TemplateSchema: Schema = new Schema({
  name: { type: String, required: true },
  thumbnail: { type: String },
  preview: { type: String },
  pages: { type: Array, default: [] },
  page_backgrounds: { type: [String], default: ['#ffffff'] },
  elements: { type: Array, default: [] },
  backgroundColor: { type: String, default: '#ffffff' },
  category: { type: String, default: 'General' },
  active: { type: Boolean, default: false },
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  releaseDate: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  used: { type: Number, default: 0 },
  usageCount: { type: Number, default: 0 }
}, { timestamps: true });

export default (mongoose.models.Template as mongoose.Model<ITemplate>) || mongoose.model<ITemplate>('Template', TemplateSchema);