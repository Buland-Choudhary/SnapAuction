import { PrismaClient } from '@prisma/client';
import { cloudinary } from '../config/cloudinary.js';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();

// Utility: Delete local temp uploads older than 5 minutes
async function cleanupTmpUploads() {
  const uploadDir = path.join(process.cwd(), 'tmp_uploads');
  try {
    const files = await fs.readdir(uploadDir);
    const now = Date.now();
    for (const file of files) {
      const filePath = path.join(uploadDir, file);
      const stats = await fs.stat(filePath);
      if (now - stats.mtimeMs > 5 * 60 * 1000) {
        await fs.unlink(filePath);
      }
    }
  } catch (err) {
    console.error('⚠️ Error cleaning tmp_uploads:', err);
  }
}


// 🔍 All Auctions (live, past, future)
export const getAll = async (req, res) => {
  try {
    const auctions = await prisma.auction.findMany({
      orderBy: { endTime: 'asc' },
      include: {
        images: true,
        seller: { select: { id: true, name: true } },
      },
    });
    res.json(auctions);
  } catch (err) {
    console.error('❌ Failed to fetch auctions:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🔍 Live Auctions (started, not closed, not ended)
export const getLive = async (req, res) => {
  try {
    const now = new Date();
    const auctions = await prisma.auction.findMany({
      where: {
        isClosed: false,
        startTime: { lte: now },
        endTime: { gte: now },
      },
      orderBy: { endTime: 'asc' },
      include: {
        images: true,
        seller: { select: { id: true, name: true } },
      },
    });
    res.json(auctions);
  } catch (err) {
    console.error('❌ Failed to fetch live auctions:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🔮 Upcoming Auctions (not yet started)
export const getUpcoming = async (req, res) => {
  try {
    const now = new Date();
    const auctions = await prisma.auction.findMany({
      where: {
        startTime: { gt: now },
      },
      orderBy: { startTime: 'asc' },
      include: {
        images: true,
        seller: { select: { id: true, name: true } },
      },
    });
    res.json(auctions);
  } catch (err) {
    console.error('❌ Failed to fetch upcoming auctions:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🔎 Single Auction Detail
export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const auction = await prisma.auction.findUnique({
      where: { id },
      include: {
        images: true,
        seller: { select: { id: true, name: true } },
        winner: { select: { id: true, name: true } },
        bids: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { amount: 'desc' },
        },
        follows: true,
      },
    });

    if (!auction) return res.status(404).json({ message: 'Auction not found' });

    res.json(auction);
  } catch (err) {
    console.error('❌ Failed to fetch auction details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const createAuction = async (req, res) => {
  try {
    // 1. Extract form fields
    const {
      title, description,
      basePrice, minIncrement, maxIncrement,
      startTime, endTime
    } = req.body;

    const files = Array.isArray(req.files) ? req.files : [];
    // 2. Upload each file to Cloudinary
    const uploaded = await Promise.all(
      files.map(f =>
        cloudinary.uploader.upload(f.path, { folder: 'snapauction' })
      )
    );
    const imageUrls = uploaded.map(u => ({ url: u.secure_url }));

    // 3. Create auction + images in DB
    const auction = await prisma.auction.create({
      data: {
        title, description,
        basePrice: parseFloat(basePrice),
        currentPrice: parseFloat(basePrice),
        minIncrement: parseFloat(minIncrement),
        maxIncrement: maxIncrement ? parseFloat(maxIncrement) : null,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        sellerId: req.user.id,
        images: { create: imageUrls },
      },
      include: { images: true },
    });
    cleanupTmpUploads();

    res.status(201).json(auction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not create auction' });
  }
};



// ⭐ Follow an Auction
export const followAuction = async (req, res) => {
  try {
    const { id: auctionId } = req.params;
    const userId = req.user.id;

    const existing = await prisma.follow.findFirst({
      where: { auctionId, userId },
    });
    if (existing) return res.status(400).json({ message: 'Already following' });

    await prisma.follow.create({
      data: { auctionId, userId },
    });

    res.status(200).json({ message: 'Followed auction' });
  } catch (err) {
    console.error('❌ Failed to follow auction:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🚫 Unfollow an Auction
export const unfollowAuction = async (req, res) => {
  try {
    const { id: auctionId } = req.params;
    const userId = req.user.id;

    await prisma.follow.deleteMany({
      where: { auctionId, userId },
    });

    res.status(200).json({ message: 'Unfollowed auction' });
  } catch (err) {
    console.error('❌ Failed to unfollow auction:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
