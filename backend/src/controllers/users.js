import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * GET /users/dashboard
 * Returns:
 *  - created: auctions the user has created
 *  - follows: auctions the user is following
 *  - bids:    bids the user has placed
 *  - wins:    auctions the user has won
 */
export const getDashboard = async (req, res) => {
  const userId = req.user.id;

  try {
    // 1) Auctions this user created
    const created = await prisma.auction.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: "desc" },
      include: { images: true },
    });

    // 2) Auctions this user follows
    const followsRaw = await prisma.follow.findMany({
      where: { userId },
      include: {
        auction: {
          include: { images: true, seller: { select: { id: true, name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    const follows = followsRaw.map((f) => f.auction);

    // 3) Bids this user has placed
    const bids = await prisma.bid.findMany({
      where: { userId },
      include: {
        auction: { select: { id: true, title: true, endTime: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // 4) Auctions this user has won
    const wins = await prisma.auction.findMany({
      where: { winnerId: userId },
      include: { images: true, seller: { select: { id: true, name: true } } },
      orderBy: { endTime: "desc" },
    });

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
