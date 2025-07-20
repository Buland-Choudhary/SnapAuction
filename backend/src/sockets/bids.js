import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const handleAuctionSocket = (io) => {
  console.log('🔌 Setting up auction socket handlers...');

  io.on('connection', (socket) => {
    console.log('✅ Socket connected:', socket.id);

    // Join auction room
    socket.on('join_auction', (auctionId) => {
      const room = `auction_${auctionId}`;
      socket.join(room);
      console.log(`📡 Socket ${socket.id} joined auction room: ${room}`);
    });

    // Leave auction room
    socket.on('leave_auction', (auctionId) => {
      const room = `auction_${auctionId}`;
      socket.leave(room);
      console.log(`📡 Socket ${socket.id} left auction room: ${room}`);
    });

    // Place bid via socket
    socket.on('place_bid', async (data, callback) => {
      console.log('🔥 Received place_bid event:', data);
      
      try {
        const { auctionId, amount, tokenUserId } = data;

        // Validate input
        if (!auctionId || !amount || !tokenUserId) {
          return callback({ error: 'Missing required fields' });
        }

        const bidAmount = parseFloat(amount);
        if (isNaN(bidAmount) || bidAmount <= 0) {
          return callback({ error: 'Invalid bid amount' });
        }

        // Use a transaction to ensure data consistency
        const result = await prisma.$transaction(async (tx) => {
          // Get auction with latest bid
          const auction = await tx.auction.findUnique({
            where: { id: auctionId },
            include: {
              bids: {
                orderBy: { amount: 'desc' },
                take: 1,
              },
            },
          });

          if (!auction) {
            throw new Error('Auction not found');
          }

          // Validate auction status
          const now = new Date();
          if (auction.isClosed) {
            throw new Error('Auction is closed');
          }
          if (now < auction.startTime) {
            throw new Error('Auction has not started yet');
          }
          if (now > auction.endTime) {
            throw new Error('Auction has ended');
          }

          // Check if user is seller
          if (auction.sellerId === tokenUserId) {
            throw new Error('Cannot bid on your own auction');
          }

          // Check consecutive bids
          if (auction.bids.length > 0 && auction.bids[0].userId === tokenUserId) {
            throw new Error('Cannot place consecutive bids. Wait for another user to bid first.');
          }

          // Validate bid amount
          const currentPrice = auction.currentPrice || auction.basePrice;
          const minBid = currentPrice + auction.minIncrement;
          if (bidAmount < minBid) {
            throw new Error(`Bid must be at least $${minBid}`);
          }

          // Create the bid
          const bid = await tx.bid.create({
            data: {
              amount: bidAmount,
              auctionId,
              userId: tokenUserId,
            },
            include: {
              user: { select: { id: true, name: true } },
            },
          });

          // Update auction price
          await tx.auction.update({
            where: { id: auctionId },
            data: { currentPrice: bidAmount }
          });

          return {
            bid: {
              id: bid.id,
              amount: bid.amount,
              userId: bid.userId,
              userName: bid.user.name,
              createdAt: bid.createdAt.toISOString(),
            },
            newCurrentPrice: bidAmount,
            auctionId,
          };
        });

        // Broadcast to everyone in room
        const room = `auction_${auctionId}`;
        io.to(room).emit('bid_placed', result);

        // Acknowledge success to the placing client
        callback({ success: true, ...result });
      } catch (err) {
        console.error('🔴 place_bid error:', err);
        callback({ error: err.message || 'Failed to place bid' });
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected:', socket.id);
    });
  });
};