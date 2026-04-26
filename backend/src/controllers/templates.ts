import { Request, Response } from 'express';
import Template from '../models/Template';

export const createTemplate = async (req: Request, res: Response) => {
  try {
    const template = await Template.create({
      ...req.body,

      pages: req.body.pages || [],
      page_backgrounds: req.body.page_backgrounds || ['#ffffff'],

      elements: req.body.pages ? req.body.pages[0] : [],
      createdBy: (req as any).user.id
    });
    res.status(201).json(template);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTemplates = async (req: Request, res: Response) => {
    try {
        const templates = await Template.find()
          .populate('createdBy', 'firstname lastname')
          .sort({ createdAt: -1 });
        res.json(templates);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching templates' });
    }
};

export const getTemplateById = async (req: Request, res: Response) => {
    try {
        const template = await Template.findById(req.params.id);
        if (!template) return res.status(404).json({ error: 'Not found' });
        res.json(template);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching template' });
    }
};

export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const updated = await Template.findByIdAndUpdate(
      req.params.id,
      {
          ...req.body,
          pages: req.body.pages,
          page_backgrounds: req.body.page_backgrounds,
          elements: req.body.pages ? req.body.pages[0] : []
      },
      { new: true }
    );
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTemplate = async (req: Request, res: Response) => {
    try {
        await Template.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting' });
    }
};