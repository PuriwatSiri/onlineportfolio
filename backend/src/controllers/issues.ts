import { Request, Response } from 'express';
import { Issue } from '../models/Others';

// User ส่งเรื่อง
export const createIssue = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const startOfDay = new Date(year, now.getMonth(), now.getDate());
    const count = await Issue.countDocuments({ report_date: { $gte: startOfDay } });
    const sequence = String(count + 1).padStart(4, '0');
    const customIssueId = `${year}${month}${day}${hours}${mins}${sequence}`;
    const issue = await Issue.create({ ...req.body, user_id: user.id, issueId: customIssueId});
    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ error: 'Error reporting issue' });
  }
};

// Admin ดูรายการ
export const getIssues = async (req: Request, res: Response) => {
  try {
    const issues = await Issue.find().populate('user_id', 'firstname lastname email').sort({ report_date: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching issues' });
  }
};

// list current user's reports
export const getMyIssues = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const issues = await Issue.find({ user_id: userId }).sort({ report_date: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user issues' });
  }
};

// Admin อัปเดตสถานะ
export const updateIssue = async (req: Request, res: Response) => {
  try {
    const updated = await Issue.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error updating issue' });
  }
};