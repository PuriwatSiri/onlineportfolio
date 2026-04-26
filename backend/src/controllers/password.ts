import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { User, PasswordReset } from '../models';

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user: any = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email not found.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');


    await PasswordReset.deleteMany({ user_id: user._id });

    await PasswordReset.create({
      user_id: user._id,
      token: resetToken,
    });

    const link = `http://localhost:5173/reset-password?token=${resetToken}&id=${user._id}`;
    
    console.log("📧 [DEBUG] Reset Link:", link); 

    res.json({ message: 'A password reset link has been sent to your email.', link: link });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending email' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { userId, token, newPassword } = req.body;


    const passwordResetRecord = await PasswordReset.findOne({
      user_id: userId,
      token: token
    });

    if (!passwordResetRecord) {
      return res.status(400).json({ message: 'Invalid or expired link.' });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);


    await User.findByIdAndUpdate(userId, { 
      password: hashedPassword 
    });


    await PasswordReset.deleteOne({ _id: passwordResetRecord._id });

    res.json({ message: 'Password changed successfully.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};