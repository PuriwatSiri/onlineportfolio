import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// include user role in token so middleware can verify admin privileges
const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ บวกเวลาฟรี 7 วัน
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 7);

    const user: any = await User.create({
      firstname, lastname, email, password: hashedPassword,
      packageExpire: expireDate
    });

    if (user) {
      res.status(201).json({
        user: {
           _id: user.id, firstname: user.firstname, lastname: user.lastname,
           email: user.email, role: user.role, packageExpire: user.packageExpire,
           packageId: user.packageId
        },
        token: generateToken(user.id, user.role)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user: any = await User.findOne({ email });

    if (user && user.status === 'Suspended') {
      return res.status(403).json({ message: 'Your account has been suspended. Please contact the administrator.' });
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        user: {
           _id: user.id, firstname: user.firstname, lastname: user.lastname,
           email: user.email, role: user.role, packageExpire: user.packageExpire,
           packageId: user.packageId
        },
        token: generateToken(user.id, user.role)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.id).select('-password');
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-password').sort({ role: 1, createdAt: -1 }).populate('packageId');
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) res.json(user);
    else res.status(404).json({ message: 'User not found' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user: any = await User.findById(req.params.id);
    if (user) {
      user.firstname = req.body.firstname || user.firstname;
      user.lastname = req.body.lastname || user.lastname;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      user.status = req.body.status || user.status;
      if (req.body.packageExpire !== undefined) {
         user.packageExpire = req.body.packageExpire;
      }
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) res.json({ message: 'User removed' });
    else res.status(404).json({ message: 'User not found' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};