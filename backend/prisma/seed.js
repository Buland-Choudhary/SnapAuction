// prisma/seed.js
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

console.log('🔌 Connecting to DB:', process.env.DATABASE_URL);

const prisma = new PrismaClient();

function minutesFromNow(mins) {
  return new Date(Date.now() + mins * 60 * 1000);
}

function minutesAgo(mins) {
  return new Date(Date.now() - mins * 60 * 1000);
}

async function main() {
  console.log('🧹 Clearing existing data...');
  await prisma.bid.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.auctionImage.deleteMany();
  await prisma.auction.deleteMany();
  await prisma.user.deleteMany();

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
  console.log(`🔐 Hashing password with ${saltRounds} salt rounds...`);
  const passwordHash = await bcrypt.hash('secret123', saltRounds);

  console.log('👥 Creating users...');
  const users = await Promise.all(
    ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'].map((name, i) =>
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

  console.log('📦 Creating auctions...');
  const auctions = await Promise.all([
    prisma.auction.create({
      data: {
        title: 'Vintage Watch',
        description: 'A timeless Rolex Submariner.',
        basePrice: 500,
        currentPrice: 500,
        minIncrement: 50,
        startTime: minutesAgo(60),
        endTime: minutesFromNow(60),
        isClosed: false,
        sellerId: users[0].id,
        createdAt: minutesAgo(65),
        images: {
          create: [{ url: 'https://example.com/watch.jpg' }],
        },
      },
    }),
    prisma.auction.create({
      data: {
        title: 'MacBook Pro M2',
        description: 'Almost new, 16GB RAM, 512GB SSD.',
        basePrice: 1000,
        currentPrice: 1000,
        minIncrement: 100,
        startTime: minutesAgo(20),
        endTime: minutesFromNow(90),
        isClosed: false,
        sellerId: users[1].id,
        createdAt: minutesAgo(25),
        images: {
          create: [{ url: 'https://example.com/macbook.jpg' }],
        },
      },
    }),
    prisma.auction.create({
      data: {
        title: 'Gaming Console',
        description: 'PlayStation 5, unopened box.',
        basePrice: 300,
        currentPrice: 300,
        minIncrement: 20,
        startTime: minutesFromNow(10), // Not started yet
        endTime: minutesFromNow(120),
        isClosed: false,
        sellerId: users[2].id,
        createdAt: minutesAgo(5),
        images: {
          create: [{ url: 'https://example.com/ps5.jpg' }],
        },
      },
    }),
  ]);

  console.log('💰 Adding bids (only to active auctions)...');
  await prisma.bid.createMany({
    data: [
      {
        amount: 550,
        userId: users[3].id,
        auctionId: auctions[0].id,
        createdAt: minutesAgo(55),
      },
      {
        amount: 600,
        userId: users[4].id,
        auctionId: auctions[0].id,
        createdAt: minutesAgo(50),
      },
      {
        amount: 1100,
        userId: users[2].id,
        auctionId: auctions[1].id,
        createdAt: minutesAgo(15),
      },
    ],
  });

  console.log('⭐ Creating follows...');
  await prisma.follow.createMany({
    data: [
      {
        userId: users[4].id,
        auctionId: auctions[0].id,
        createdAt: minutesAgo(40),
      },
      {
        userId: users[5].id,
        auctionId: auctions[1].id,
        createdAt: minutesAgo(10),
      },
      {
        userId: users[3].id,
        auctionId: auctions[2].id,
        createdAt: minutesAgo(2),
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
