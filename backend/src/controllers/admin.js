// src/controllers/admin.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
  try {
    console.log('[ADMIN] Fetching all users');
    const users = await prisma.user.findMany({});
    res.json(users);
  } catch (err) {
    console.error('[ADMIN] getUsers error:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const getAuctions = async (req, res) => {
  try {
    console.log('[ADMIN] Fetching all auctions');
    const auctions = await prisma.auction.findMany({});
    res.json(auctions);
  } catch (err) {
    console.error('[ADMIN] getAuctions error:', err);
    res.status(500).json({ message: 'Failed to fetch auctions' });
  }
};

export const deleteAuction = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[ADMIN] Deleting auction: ${id}`);
    await prisma.auction.delete({ where: { id } });
    res.json({ message: 'Auction deleted', auctionId: id });
  } catch (err) {
    console.error('[ADMIN] deleteAuction error:', err);
    res.status(500).json({ message: 'Failed to delete auction' });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    console.log(`[ADMIN] Updating user role: ${id} -> ${role}`);
    const updated = await prisma.user.update({ where: { id }, data: { role } });
    res.json({ message: 'User role updated', user: updated });
  } catch (err) {
    console.error('[ADMIN] updateUserRole error:', err);
    res.status(500).json({ message: 'Failed to update user role' });
  }
};
