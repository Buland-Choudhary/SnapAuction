import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const placeBid = async (req, res) => {
  try {
    const { auctionId, amount } = req.body;
    const userId = req.user.id;
    console.log(`[BIDS] User ${userId} placing bid on auction ${auctionId} for $${amount}`);
    if (!auctionId || !amount) {
      console.warn('[BIDS] Missing auctionId or amount');
      return res.status(400).json({ message: 'Auction ID and amount are required' });
    }
    const bidAmount = parseFloat(amount);
    if (isNaN(bidAmount) || bidAmount <= 0) {
      console.warn('[BIDS] Invalid bid amount:', amount);
      return res.status(400).json({ message: 'Invalid bid amount' });
    }
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: {
        bids: {
          orderBy: { amount: 'desc' },
          take: 1,
        },
      },
    });
    if (!auction) {
      console.warn(`[BIDS] Auction not found: ${auctionId}`);
      return res.status(404).json({ message: 'Auction not found' });
    }
    const now = new Date();
    if (auction.isClosed) {
      console.warn('[BIDS] Auction is closed');
      return res.status(400).json({ message: 'Auction is closed' });
    }
    if (now < auction.startTime) {
      console.warn('[BIDS] Auction has not started yet');
      return res.status(400).json({ message: 'Auction has not started yet' });
    }
    if (now > auction.endTime) {
      console.warn('[BIDS] Auction has ended');
      return res.status(400).json({ message: 'Auction has ended' });
    }
    if (auction.sellerId === userId) {
      console.warn('[BIDS] User tried to bid on their own auction');
      return res.status(400).json({ message: 'Cannot bid on your own auction' });
    }
    if (auction.bids.length > 0 && auction.bids[0].userId === userId) {
      console.warn('[BIDS] User tried to place consecutive bids');
      return res.status(400).json({ message: 'Cannot place consecutive bids. Wait for another user to bid first.' });
    }
    const currentPrice = auction.currentPrice || auction.basePrice;
    const minBid = currentPrice + auction.minIncrement;
    if (bidAmount < minBid) {
      console.warn(`[BIDS] Bid too low: $${bidAmount} < $${minBid}`);
      return res.status(400).json({ message: `Bid must be at least $${minBid}` });
    }
    if (auction.maxIncrement) {
      const increment = bidAmount - currentPrice;
      if (increment > auction.maxIncrement) {
        console.warn(`[BIDS] Bid increment too high: $${increment} > $${auction.maxIncrement}`);
        return res.status(400).json({ 
          message: `Bid increment cannot exceed $${auction.maxIncrement}` 
        });
      }
    }
    const bid = await prisma.bid.create({
      data: {
        amount: bidAmount,
        auctionId,
        userId,
      },
      include: {
        user: { select: { id: true, name: true } },
        auction: { select: { id: true, title: true } },
      },
    });
    await prisma.auction.update({
      where: { id: auctionId },
      data: { currentPrice: bidAmount },
    });
    console.log(`[BIDS] Bid placed: $${bidAmount} by user ${userId} on auction ${auctionId}`);
    res.status(201).json({
      message: 'Bid placed successfully',
      bid,
      newCurrentPrice: bidAmount,
    });
  } catch (err) {
    console.error('[BIDS] placeBid error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAuctionBids = async (req, res) => {
  try {
    const { id } = req.params;
    const bids = await prisma.bid.findMany({
      where: { auctionId: id },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { amount: 'desc' },
    });
    console.log(`[BIDS] Fetched bids for auction ${id}:`, bids.length);
    res.json(bids);
  } catch (err) {
    console.error('[BIDS] Failed to fetch auction bids:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};