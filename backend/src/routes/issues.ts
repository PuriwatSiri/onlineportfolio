import express from 'express';
import { auth, isAdmin } from '../middleware/auth';
import { createIssue, getIssues, updateIssue, getMyIssues } from '../controllers/issues';

const router = express.Router();

router.post('/', auth, createIssue);
router.get('/me', auth, getMyIssues); 
router.get('/', auth, isAdmin, getIssues); 
router.put('/:id', auth, isAdmin, updateIssue); 

export default router;