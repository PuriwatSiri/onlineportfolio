import mongoose, { Schema } from 'mongoose';

const passwordResetSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600
  }
});

export default mongoose.model('PasswordReset', passwordResetSchema);