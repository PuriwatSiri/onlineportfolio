import express from 'express';

import {
  createPortfolio,
  getUserPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  getPublicPortfolio
} from '../controllers/portfolios';


import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/view/:id', getPublicPortfolio);

router.use(auth)

router.post('/', createPortfolio);

router.get('/me', getUserPortfolios);
router.get('/:id', getPortfolioById);
router.put('/:id', updatePortfolio);
router.delete('/:id', deletePortfolio);

export default router;