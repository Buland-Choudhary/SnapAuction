import express from 'express';
import {
  getAll,
  getLive,
  getUpcoming,
  getById,
  createAuction,
  followAuction,
  unfollowAuction,
} from '../controllers/auctions.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAll);               // List all auctions
router.get('/live', getLive);          // List live auctions
router.get('/upcoming', getUpcoming);  // List upcoming auctions
router.get('/:id', getById);           // Get auction details by ID

// Protected routes
router.post('/', authMiddleware, createAuction);                  // Create auction
router.post('/:id/follow', authMiddleware, followAuction);        // Follow auction
router.delete('/:id/unfollow', authMiddleware, unfollowAuction);  // Unfollow auction

export default router;
