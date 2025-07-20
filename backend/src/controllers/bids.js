import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const placeBid = async (req, res) => {
  try {
    const { auctionId, amount } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!auctionId || !amount) {
      return res.status(400).json({ message: 'Auction ID and amount are required' });
    }

    const bidAmount = parseFloat(amount);
    if (isNaN(bidAmount) || bidAmount <= 0) {
      return res.status(400).json({ message: 'Invalid bid amount' });
    }

    // Get auction details
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
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Check if auction is live
    const now = new Date();
    if (auction.isClosed) {
      return res.status(400).json({ message: 'Auction is closed' });
    }

    if (now < auction.startTime) {
      return res.status(400).json({ message: 'Auction has not started yet' });
    }

    if (now > auction.endTime) {
      return res.status(400).json({ message: 'Auction has ended' });
    }

    // Check if user is trying to bid on their own auction
    if (auction.sellerId === userId) {
      return res.status(400).json({ message: 'Cannot bid on your own auction' });
    }

    // Check if the latest bid is from the same user
    if (auction.bids.length > 0 && auction.bids[0].userId === userId) {
      return res.status(400).json({ message: 'Cannot place consecutive bids. Wait for another user to bid first.' });
    }

    // Validate bid amount
    const currentPrice = auction.currentPrice || auction.basePrice;
    const minBid = currentPrice + auction.minIncrement;
    if (bidAmount < minBid) {
      return res.status(400).json({ message: `Bid must be at least $${minBid}` });
    }

    // Check max increment if specified
    if (auction.maxIncrement) {
      const increment = bidAmount - currentPrice;
      if (increment > auction.maxIncrement) {
        return res.status(400).json({ 
          message: `Bid increment cannot exceed $${auction.maxIncrement}` 
        });
      }
    }

    // Create the bid
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

    // Update auction's current price
    await prisma.auction.update({
      where: { id: auctionId },
      data: { currentPrice: bidAmount },
    });

    res.status(201).json({
      message: 'Bid placed successfully',
      bid,
      newCurrentPrice: bidAmount,
    });

  } catch (err) {
    console.error('❌ placeBid error:', err);
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

    res.json(bids);
  } catch (err) {
    console.error('❌ Failed to fetch auction bids:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};