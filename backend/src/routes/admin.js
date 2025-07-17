// src/routes/admin.js
import express from 'express';
import {
  getUsers,
  getAuctions,
  deleteAuction,
  updateUserRole,
} from '../controllers/admin.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/admin/users - List all users
router.get('/users', authMiddleware, adminMiddleware, getUsers);

// GET /api/admin/auctions - List all auctions
router.get('/auctions', authMiddleware, adminMiddleware, getAuctions);

// DELETE /api/admin/auction/:id - Delete an auction
router.delete('/auction/:id', authMiddleware, adminMiddleware, deleteAuction);

// PATCH /api/admin/user/:id/role - Promote/demote a user
router.patch('/user/:id/role', authMiddleware, adminMiddleware, updateUserRole);

export default router;
