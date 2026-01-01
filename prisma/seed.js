const { PrismaClient } = require('@prisma/client');
const { CARS } = require('../src/data.js');

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);
  for (const car of CARS) {
    const price = parseInt(car.price.replace('₹', '').replace(',', ''));
    const product = await prisma.product.create({
      data: {
        name: car.name,
        brand: car.brand,
        price: price,
        scale: car.scale,
        image: car.image,
        video: car.video,
        size: car.size,
        description: car.description,
        material: car.material,
        condition: car.condition,
        disclaimer: car.disclaimer,
        stock: 10, // Default stock
      },
    });
    console.log(`Created product with id: ${product.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
