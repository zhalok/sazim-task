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
  const products = [
    {
      name: 'Product 1',
      description: 'Description 1',
      price: 9.99,
      stock: 1000,
    },
    {
      name: 'Product 2',
      description: 'Description 2',
      price: 19.99,
      stock: 50,
    },
    {
      name: 'Product 3',
      description: 'Description 3',
      price: 14.99,
      stock: 200,
    },
    {
      name: 'Product 4',
      description: 'Description 4',
      price: 24.99,
      stock: 75,
    },
    {
      name: 'Product 5',
      description: 'Description 5',
      price: 29.99,
      stock: 150,
    },
    {
      name: 'Product 6',
      description: 'Description 6',
      price: 19.99,
      stock: 100,
    },
    {
      name: 'Product 7',
      description: 'Description 7',
      price: 9.99,
      stock: 500,
    },
    {
      name: 'Product 8',
      description: 'Description 8',
      price: 14.99,
      stock: 250,
    },
    {
      name: 'Product 9',
      description: 'Description 9',
      price: 24.99,
      stock: 100,
    },
    {
      name: 'Product 10',
      description: 'Description 10',
      price: 19.99,
      stock: 300,
    },
  ].map((product) => {
    return prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        uploaderId: sellerUser.Seller.id,
      },
    });
  });
  await Promise.all(products);
  console.log('✅ Products created:');

  // 🔹 Create a Customer (User with role USER)

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
