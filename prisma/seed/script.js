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
  console.log('✅ Customer User created:', customerUser);

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
