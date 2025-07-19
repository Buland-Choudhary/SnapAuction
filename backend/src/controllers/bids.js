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
    const currentHighestBid = auction.bids.length > 0 ? auction.bids[0].amount : auction.basePrice;
    const minimumBid = currentHighestBid + auction.minIncrement;

    if (bidAmount < minimumBid) {
      return res.status(400).json({ 
        message: `Bid must be at least $${minimumBid} (current: $${currentHighestBid} + minimum increment: $${auction.minIncrement})` 
      });
    }

    // Check maximum increment if set
    if (auction.maxIncrement && bidAmount > currentHighestBid + auction.maxIncrement) {
      return res.status(400).json({ 
        message: `Bid cannot exceed maximum increment of $${auction.maxIncrement}` 
      });
    }

    // Create the bid
    console.log("userId", userId);
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

    // TODO: Emit real-time update via Socket.IO
    // io.to(auctionId).emit('bid_placed', { bid, newCurrentPrice: bidAmount });

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
    const { id: auctionId } = req.params;

    // Get auction with all its bids
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: {
        bids: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    res.json({
      auctionId,
      bids: auction.bids,
      totalBids: auction.bids.length,
      currentPrice: auction.currentPrice,
      basePrice: auction.basePrice,
    });

  } catch (err) {
    console.error('❌ getAuctionBids error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};