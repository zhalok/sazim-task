const {
  PrismaClient,
  Role,
  OrderStatus,
  RentStatus,
} = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 🔹 Create a Seller (User with role SELLER)
  const sellerUser = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword', // In real apps, hash the password!
      role: Role.SELLER,
      Seller: {
        create: {
          company: {
            create: { name: 'TechCorp' },
          },
          rating: 4.8,
        },
      },
    },
    include: { Seller: true },
  });

  console.log('✅ Seller User created:', sellerUser);

  // 🔹 Create Products for Seller
  const product1 = await prisma.product.create({
    data: {
      name: 'Smartphone',
      description: 'Latest 5G smartphone',
      price: 799.99,
      stock: 50,
      sellerId: sellerUser.Seller.id, // Associate with seller
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Laptop',
      description: 'High-performance laptop',
      price: 1299.99,
      stock: 20,
      sellerId: sellerUser.Seller?.id,
    },
  });

  console.log('✅ Products created:', product1, product2);

  // 🔹 Create a Customer (User with role USER)
  const customerUser = await prisma.user.create({
    data: {
      name: 'Alice Smith',
      email: 'alice@example.com',
      password: 'hashedpassword',
      role: Role.USER,
      Customer: {
        create: {
          name: 'Alice Smith',
          phone: '1234567890',
          email: 'alice@example.com',
          address: '123 Main Street',
        },
      },
    },
    include: { Customer: true },
  });

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
