import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { User, PasswordReset } from '../models';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

    const frontendUrl = process.env.FRONTEND_URL || 'https://onlineportfoliomanagement.netlify.app';
    const link = `${frontendUrl}/reset-password?token=${resetToken}&id=${user._id}`;


    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset - Online Portfolio Management',
      html: `
        <div style="font-family: sans-serif; line-height: 1.5;">
          <h2>Password Reset Request</h2>
          <p>You are receiving this email because we received a password reset request for your account. Please click the button below to set a new password:</p>
          <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #1a1a1a; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p style="color: red; font-size: 14px;">* This link will expire in 15 minutes.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("[DEBUG] Email sent to:", email);

    res.json({ message: 'A password reset link has been sent to your email.' });

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