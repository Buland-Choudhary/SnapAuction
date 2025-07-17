import express from 'express';
import { login, signup, logout } from '../controllers/auth.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

export default router;
