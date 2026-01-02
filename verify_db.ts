import prisma from './src/lib/prisma';

async function main() {
  try {
    console.log('Attempting to connect to the database...');
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection successful!', result);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
