// user.js (or wherever your controller lives)
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * GET /users/dashboard
 * Returns created, follows, bids (with isHighest), wins
 */
export const getDashboard = async (req, res) => {
  const userId = req.user.id;
  try {
    console.log(`[USERS] Fetching dashboard for user ${userId}`);
    const [created, followsRaw, rawBids, wins] = await prisma.$transaction(
      async (tx) => {
        const created = await tx.auction.findMany({
          where: { sellerId: userId },
          orderBy: { createdAt: "desc" },
          include: { images: true },
        });
        const followsRaw = await tx.follow.findMany({
          where: { userId },
          include: {
            auction: {
              include: {
                images: true,
                seller: { select: { id: true, name: true } },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });
        const rawBids = await tx.bid.findMany({
          where: { userId },
          include: {
            auction: {
              select: {
                id: true,
                title: true,
                endTime: true,
                currentPrice: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });
        const wins = await tx.auction.findMany({
          where: { winnerId: userId },
          include: {
            images: true,
            seller: { select: { id: true, name: true } },
          },
          orderBy: { endTime: "desc" },
        });
        return [created, followsRaw, rawBids, wins];
      },
      { maxWait: 5000, timeout: 30000 }
    );
    const follows = followsRaw.map((f) => f.auction);
    const bids = rawBids.map((b) => ({
      ...b,
      isHighest: b.amount === b.auction.currentPrice,
    }));
    console.log(`[USERS] Dashboard data ready for user ${userId}`);
    res.json({ created, follows, bids, wins });
  } catch (err) {
    console.error("[USERS] getDashboard error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /users/me/bids
 */
export const getUserBids = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`[USERS] Fetching bids for user ${userId}`);
    const bids = await prisma.bid.findMany({
      where: { userId },
      include: {
        auction: { select: { id: true, title: true, endTime: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    console.log(`[USERS] Found ${bids.length} bids for user ${userId}`);
    res.json(bids);
  } catch (err) {
    console.error("[USERS] getUserBids error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /users/me/auctions
 */
export const getUserAuctions = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`[USERS] Fetching auctions for user ${userId}`);
    const auctions = await prisma.auction.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: "desc" },
      include: { images: true },
    });
    console.log(`[USERS] Found ${auctions.length} auctions for user ${userId}`);
    res.json(auctions);
  } catch (err) {
    console.error("[USERS] getUserAuctions error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
