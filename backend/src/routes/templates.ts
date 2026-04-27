import express from 'express';
import { auth } from '../middleware/auth';
import {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate
} from '../controllers/templates';

const router = express.Router();

router.get('/', getTemplates);
router.get('/:id', getTemplateById);
router.post('/', auth, createTemplate);
router.put('/:id', auth, updateTemplate);
router.delete('/:id', auth, deleteTemplate);

export default router;