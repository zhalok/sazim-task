import { Global, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from './entities/product.entity';
@Injectable()
export class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(product: Omit<Product, 'id'>) {
    const prisma: PrismaClient = this.prismaService.getPrismaClient();
    const seller = await prisma.seller.findFirst({});

    const productCreateResult = await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        uploaderId: seller.id,
      },
    });

    return productCreateResult;
  }

  async getProducts({ page, limit }: { limit: number; page: number }) {
    const prisma: PrismaClient = this.prismaService.getPrismaClient();
    const _page = Math.max(page, 1);
    const _limit = Math.max(limit, 1);
    console.log((_page - 1) * _limit);

    const products = await prisma.product.findMany({
      skip: (_page - 1) * _limit,
      take: _limit,
    });
    return products;
  }

  async getProductById(id: string) {
    const prisma = this.prismaService.getPrismaClient();
    const product = await prisma.product.findFirst({
      where: {
        id: id,
      },
    });
    return product;
  }

  async countProducts(filter: Partial<Product & { id: string }>) {
    const prisma = this.prismaService.getPrismaClient();
    const totalProducts = await prisma.product.count({ where: filter });
    return totalProducts;
  }

  async updateProduct(id: string, product: Omit<Partial<Product>, 'id'>) {
    const prisma = this.prismaService.getPrismaClient();
    const productUpdateResult = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
      },
    });
    return productUpdateResult;
  }

  async removeProduct(id: string) {
    const prisma = this.prismaService.getPrismaClient();
    const productRemoveResult = await prisma.product.delete({
      where: {
        id: id,
      },
    });
    return productRemoveResult;
  }
}
