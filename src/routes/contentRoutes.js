import express from 'express';
import { generateContent, getUserContent } from '../controllers/contentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', authenticate, generateContent);
router.get('/user', authenticate, getUserContent);

export default router;