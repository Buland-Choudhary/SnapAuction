import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL is undefined!');
}

try {
  new URL(process.env.DATABASE_URL);
  console.log('✅ DATABASE_URL is a valid URI');
} catch (e) {
  console.error('❌ DATABASE_URL is NOT a valid URI:', process.env.DATABASE_URL);
  process.exit(1);
}

const prisma = new PrismaClient();
await prisma.$connect();
console.log('✅ Connected to DB');
// Time helpers
function minutesFromNow(mins) {
  return new Date(Date.now() + mins * 60 * 1000);
}
function minutesAgo(mins) {
  return new Date(Date.now() - mins * 60 * 1000);
}
function daysFromNow(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}
function daysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

async function main() {
  console.log('🧹 Clearing existing data...');
  await prisma.bid.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.auctionImage.deleteMany();
  await prisma.auction.deleteMany();
  await prisma.user.deleteMany();

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
  console.log(`🔐 Hashing default password with ${saltRounds} salt rounds...`);
  const passwordHash = await bcrypt.hash('secret123', saltRounds);

  console.log('👥 Creating users...');
  const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy', 'Mallory', 'Niaj'];
  const users = [];
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const user = await prisma.user.create({
      data: {
        name,
        email: `${name.toLowerCase()}@example.com`,
        passwordHash,
        role: i === 1 ? 'ADMIN' : 'USER',
        createdAt: minutesAgo(120 - i * 10),
      },
    });
    users.push(user);
  }

  // Evergreen auction timing logic
  // 4 live, 4 upcoming, 4 recently ended
  const now = new Date();
  function randomImage() {
    // Use picsum for variety
    return `https://picsum.photos/seed/${Math.floor(Math.random()*10000)}/400/300`;
  }
  const auctionData = [];
  // Live auctions (start: 1-2h ago, end: 2-4h from now)
  for (let i = 0; i < 4; i++) {
    auctionData.push({
      title: `Live Auction #${i+1}`,
      description: `This is a live auction for item #${i+1}.`,
      basePrice: 100 + i * 50,
      minIncrement: 10 + i * 5,
      startTime: minutesAgo(120 - i * 20),
      endTime: minutesFromNow(120 + i * 30),
      sellerId: users[i].id,
      images: [randomImage(), randomImage()],
      isClosed: false,
    });
  }
  // Upcoming auctions (start: 1-4 days from now, end: 2-6 days from now)
  for (let i = 0; i < 4; i++) {
    auctionData.push({
      title: `Upcoming Auction #${i+1}`,
      description: `This is an upcoming auction for item #${i+1}.`,
      basePrice: 200 + i * 60,
      minIncrement: 15 + i * 5,
      startTime: daysFromNow(1 + i),
      endTime: daysFromNow(2 + i),
      sellerId: users[4 + i].id,
      images: [randomImage()],
      isClosed: false,
    });
  }
  // Recently ended auctions (start: 5-8 days ago, end: 1-4 days ago)
  for (let i = 0; i < 4; i++) {
    auctionData.push({
      title: `Ended Auction #${i+1}`,
      description: `This is a recently ended auction for item #${i+1}.`,
      basePrice: 150 + i * 40,
      minIncrement: 12 + i * 4,
      startTime: daysAgo(8 - i),
      endTime: daysAgo(4 - i),
      sellerId: users[8 + i].id,
      images: [randomImage(), randomImage(), randomImage()],
      isClosed: true,
      winnerId: users[(i+2)%users.length].id,
    });
  }

  const auctions = [];
  for (const data of auctionData) {
    auctions.push(
      await prisma.auction.create({
        data: {
          title: data.title,
          description: data.description,
          basePrice: data.basePrice,
          currentPrice: data.basePrice,
          minIncrement: data.minIncrement,
          maxIncrement: data.maxIncrement || null,
          startTime: data.startTime,
          endTime: data.endTime,
          isClosed: data.isClosed || false,
          sellerId: data.sellerId,
          winnerId: data.winnerId || null,
          images: { create: data.images.map((url) => ({ url })) },
        },
      })
    );
  }

  // Bids: Each auction gets 2-4 bids from different users
  console.log('💰 Seeding bids across all auctions...');
  let bidId = 1;
  for (let i = 0; i < auctions.length; i++) {
    const auction = auctions[i];
    const numBids = 2 + (i % 3); // 2-4 bids
    let lastAmount = auction.basePrice;
    for (let j = 0; j < numBids; j++) {
      // Pick a user who is not the seller
      let bidderIdx = (i + j + 1) % users.length;
      if (users[bidderIdx].id === auction.sellerId) {
        bidderIdx = (bidderIdx + 1) % users.length;
      }
      const increment = auction.minIncrement + Math.floor(Math.random() * 10);
      lastAmount += increment;
      // Bid time: spread out over auction duration
      let bidTime;
      if (auction.isClosed) {
        bidTime = new Date(
          auction.startTime.getTime() +
            ((auction.endTime.getTime() - auction.startTime.getTime()) * (j+1)) / (numBids+1)
        );
      } else {
        bidTime = new Date(
          auction.startTime.getTime() +
            ((now.getTime() - auction.startTime.getTime()) * (j+1)) / (numBids+1)
        );
      }
      await prisma.bid.create({
        data: {
          auctionId: auction.id,
          userId: users[bidderIdx].id,
          amount: lastAmount,
          createdAt: bidTime,
        },
      });
      // Update currentPrice and winner for closed auctions
      if (lastAmount > auction.currentPrice) {
        await prisma.auction.update({
          where: { id: auction.id },
          data: {
            currentPrice: lastAmount,
            ...(auction.isClosed ? { winnerId: users[bidderIdx].id } : {}),
          },
        });
      }
      bidId++;
    }
  }

  // Follows: Each auction gets 1-3 followers
  console.log('⭐ Seeding follows for all auctions...');
  for (let i = 0; i < auctions.length; i++) {
    const auction = auctions[i];
    const numFollows = 1 + (i % 3); // 1-3 follows
    for (let j = 0; j < numFollows; j++) {
      let followerIdx = (i + j + 3) % users.length;
      if (users[followerIdx].id === auction.sellerId) {
        followerIdx = (followerIdx + 1) % users.length;
      }
      await prisma.follow.create({
        data: {
          auctionId: auction.id,
          userId: users[followerIdx].id,
          createdAt: minutesAgo(10 * (j + 1)),
        },
      });
    }
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
