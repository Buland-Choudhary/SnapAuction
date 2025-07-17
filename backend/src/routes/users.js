import express from 'express';
import { getDashboard, getUserBids, getUserAuctions } from '../controllers/users.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/dashboard', getDashboard);
router.get('/me/bids', getUserBids);
router.get('/me/auctions', getUserAuctions);

export default router;
