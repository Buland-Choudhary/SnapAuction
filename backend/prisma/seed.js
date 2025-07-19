import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

console.log('🔌 Connecting to DB:', process.env.DATABASE_URL);
const prisma = new PrismaClient();

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
  const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Heidi'];
  const users = await Promise.all(
    names.map((name, i) =>
      prisma.user.create({
        data: {
          name,
          email: `${name.toLowerCase()}@example.com`,
          passwordHash,
          role: i === 1 ? 'ADMIN' : 'USER',
          createdAt: minutesAgo(120 - i * 10),
        },
      })
    )
  );

  console.log('📦 Seeding auctions with varied timings...');
  const auctionData = [
    // Live auctions
    {
      title: 'Vintage Rolex Watch',
      description: 'Timeless Submariner, still ticking.',
      basePrice: 500,
      minIncrement: 25,
      startTime: minutesAgo(90),
      endTime: minutesFromNow(120),
      sellerId: users[0].id,
      images: ['https://example.com/watch1.jpg', 'https://example.com/watch2.jpg'],
    },
    {
      title: 'MacBook Pro M1',
      description: '2021 model, excellent condition.',
      basePrice: 1200,
      minIncrement: 50,
      startTime: minutesAgo(30),
      endTime: minutesFromNow(150),
      sellerId: users[1].id,
      images: ['https://example.com/mac1.jpg'],
    },
    // Upcoming auctions
    {
      title: 'PlayStation 5 Console',
      description: 'Brand new, unopened.',
      basePrice: 400,
      minIncrement: 20,
      startTime: daysFromNow(1),
      endTime: daysFromNow(5),
      sellerId: users[2].id,
      images: ['https://example.com/ps5.jpg'],
    },
    {
      title: 'Electric Guitar',
      description: 'Fender Stratocaster, sunburst finish.',
      basePrice: 700,
      minIncrement: 30,
      startTime: daysFromNow(2),
      endTime: daysFromNow(4),
      sellerId: users[3].id,
      images: ['https://example.com/guitar.jpg'],
    },
    // Past auctions
    {
      title: 'Antique Vase',
      description: 'Ming dynasty era.',
      basePrice: 300,
      minIncrement: 15,
      startTime: daysAgo(5),
      endTime: daysAgo(1),
      isClosed: true,
      sellerId: users[4].id,
      images: ['https://example.com/vase.jpg'],
      winnerId: users[5].id,
    },
    {
      title: 'Wireless Headphones',
      description: 'Noise-cancelling, over-ear.',
      basePrice: 200,
      minIncrement: 20,
      startTime: minutesAgo(120),
      endTime: minutesAgo(10),
      isClosed: true,
      sellerId: users[5].id,
      images: ['https://example.com/headphones.jpg'],
      winnerId: users[0].id,
    },
  ];

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

  console.log('💰 Seeding bids across live and past auctions...');
  const bidEntries = [
    // for Vintage Watch
    { auction: auctions[0], user: users[2], amount: 550, time: minutesAgo(80) },
    { auction: auctions[0], user: users[3], amount: 600, time: minutesAgo(70) },
    { auction: auctions[1], user: users[0], amount: 1250, time: minutesAgo(20) },
    // past
    { auction: auctions[4], user: users[1], amount: 350, time: daysAgo(4) },
    { auction: auctions[5], user: users[2], amount: 250, time: minutesAgo(100) },
  ];

   for (const { auction, user, amount, time } of bidEntries) {
    // 1. Create the bid
    const bid = await prisma.bid.create({
      data: {
        auctionId: auction.id,
        userId: user.id,
        amount,
        createdAt: time,
      },
    });

    // 2. If the bid is higher than currentPrice, update currentPrice
    if (amount > auction.currentPrice) {
      await prisma.auction.update({
        where: { id: auction.id },
        data: {
          currentPrice: amount,
          // Update winner if auction is closed (optional logic)
          ...(auction.isClosed ? { winnerId: user.id } : {}),
        },
      });
    }
  }

  console.log('⭐ Seeding follows for users...');
  const followEntries = [
    { auction: auctions[0], user: users[4], time: minutesAgo(50) },
    { auction: auctions[1], user: users[5], time: minutesAgo(10) },
    { auction: auctions[2], user: users[0], time: minutesAgo(5) },
  ];

  for (const { auction, user, time } of followEntries) {
    await prisma.follow.create({
      data: {
        auctionId: auction.id,
        userId: user.id,
        createdAt: time,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
