import { Request, Response } from 'express';
import { Package } from '../models/Others';

export const getPackages = async (req: Request, res: Response) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
};

export const createPackage = async (req: Request, res: Response) => {
  try {
    const newPkg = await Package.create(req.body);
    res.status(201).json(newPkg);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create package' });
  }
};

export const updatePackage = async (req: Request, res: Response) => {
  try {
    const updated = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update package' });
  }
};

export const deletePackage = async (req: Request, res: Response) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete package' });
  }
};