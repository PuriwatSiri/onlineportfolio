import mongoose, { Schema } from 'mongoose';
import { IPortfolio } from './interfaces';

const PortfolioSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  is_public: { type: Boolean, default: false },
  cover_image: { type: String }, 
  
  // ✅ Store page data and color per page
  pages: { type: Array, default: [] }, 
  page_backgrounds: { type: [String], default: [] },

  // Old fields
  elements: { type: Array, default: [] },
  backgroundColor: { type: String, default: '#ffffff' },

  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  owner_id: { type: Schema.Types.ObjectId, ref: 'User' },
  category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
  template_id: { type: Schema.Types.ObjectId, ref: 'Template' }
}, { timestamps: true });

export default mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);