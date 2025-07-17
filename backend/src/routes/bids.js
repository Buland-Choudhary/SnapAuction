import express from 'express';
import {
  placeBid,
  getAuctionBids,
} from '../controllers/bids.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// POST /api/bids - Place a new bid (auth required)
router.post('/', authMiddleware, placeBid);

// GET /api/bids/auction/:id - Get bid history for an auction
router.get('/auction/:id', getAuctionBids);


export default router;
