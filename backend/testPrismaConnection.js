// testPrismaConnection.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('⏳ Connecting to database...');
    const users = await prisma.follow.findMany();
    console.log('✅ Connection successful. Found users:', users);
  } catch (error) {
    console.error('❌ Error connecting to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
