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
    const [created, followsRaw, rawBids, wins] = await prisma.$transaction(
      async (tx) => {
        // 1) Auctions this user created
        const created = await tx.auction.findMany({
          where: { sellerId: userId },
          orderBy: { createdAt: "desc" },
          include: { images: true },
        });

        // 2) Auctions this user follows
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

        // 3) Bids this user has placed, now including auction.currentPrice
        const rawBids = await tx.bid.findMany({
          where: { userId },
          include: {
            auction: {
              select: {
                id: true,
                title: true,
                endTime: true,
                currentPrice: true,    // ← include this
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });

        // 4) Auctions this user has won
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

    // flatten followed auctions
    const follows = followsRaw.map((f) => f.auction);

    // annotate each bid with isHighest
    const bids = rawBids.map((b) => ({
      ...b,
      isHighest: b.amount === b.auction.currentPrice,
    }));

    res.json({ created, follows, bids, wins });
  } catch (err) {
    console.error("❌ getDashboard error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


/**
 * GET /users/me/bids
 */
export const getUserBids = async (req, res) => {
  try {
    const bids = await prisma.bid.findMany({
      where: { userId: req.user.id },
      include: {
        auction: { select: { id: true, title: true, endTime: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(bids);
  } catch (err) {
    console.error("❌ getUserBids error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /users/me/auctions
 */
export const getUserAuctions = async (req, res) => {
  try {
    const auctions = await prisma.auction.findMany({
      where: { sellerId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: { images: true },
    });
    res.json(auctions);
  } catch (err) {
    console.error("❌ getUserAuctions error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
