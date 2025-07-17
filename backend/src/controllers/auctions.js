import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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

// 🛠️ Create a New Auction
export const createAuction = async (req, res) => {
  try {
    const {
      title,
      description,
      basePrice,
      minIncrement,
      maxIncrement,
      startTime,
      endTime,
      images,
    } = req.body;

    const auction = await prisma.auction.create({
      data: {
        title,
        description,
        basePrice,
        currentPrice: basePrice,
        minIncrement,
        maxIncrement,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        sellerId: req.user.id,
        images: {
          create: images?.map((url) => ({ url })) || [],
        },
      },
      include: { images: true },
    });

    res.status(201).json(auction);
  } catch (err) {
    console.error('❌ Failed to create auction:', err);
    res.status(500).json({ message: 'Internal server error' });
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
