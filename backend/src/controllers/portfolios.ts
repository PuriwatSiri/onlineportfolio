import { Request, Response } from 'express';
import { Portfolio, Template } from '../models';

export const createPortfolio = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const templateId = req.body.templateId || req.body.template_id;
    const portfolio = await Portfolio.create({
      ...req.body,
      title: req.body.title || 'Untitled Portfolio',
      user_id: user.id,
      pages: req.body.pages || [],
      page_backgrounds: req.body.page_backgrounds || ['#ffffff'],
      elements: req.body.pages ? req.body.pages[0] : []
    });

    if (templateId) {
      await Template.findByIdAndUpdate(templateId, {
        $inc: { usageCount: 1 }
      });
    }
    res.status(201).json({ message: 'Created', data: portfolio });
  } catch (error: any) {
    res.status(500).json({ error: 'Error creating', details: error.message });
  }
};

export const getUserPortfolios = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const portfolios = await Portfolio.find({ user_id: user.id }).sort({ updatedAt: -1 });
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching portfolios' });
  }
};

export const getPortfolioById = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    const isOwner = portfolio.user_id && portfolio.user_id.toString() === user.id;
    if (!isOwner && user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching portfolio' });
  }
};

export const updatePortfolio = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) return res.status(404).json({ error: 'Not found' });

    const isOwner = portfolio.user_id && portfolio.user_id.toString() === user.id;
    if (!isOwner && user.role !== 'admin') return res.status(403).json({ error: 'Not authorized' });

    const updated = await Portfolio.findByIdAndUpdate(
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
  } catch (error) {
    res.status(500).json({ error: 'Error updating' });
  }
};

export const deletePortfolio = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });

    const isOwner = portfolio.user_id && portfolio.user_id.toString() === user.id;
    if (!isOwner && user.role !== 'admin') return res.status(403).json({ error: 'Not authorized' });

    await Portfolio.findByIdAndDelete(req.params.id);
    res.json({ message: 'Portfolio deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting portfolio' });
  }
};

export const getPublicPortfolio = async (req: Request, res: Response) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio || !portfolio.is_public) {
      return res.status(404).json({ error: 'Not found or private' });
    }
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching portfolio' });
  }
};