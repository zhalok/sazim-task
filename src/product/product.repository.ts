import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { Product } from "./entities/product.entity";
@Injectable()
export class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(product: Omit<Product, "id">, sellerId: string) {
    const prisma: PrismaClient = this.prismaService.getPrismaClient();
    const seller = await prisma.seller.findFirst({});

    const productCreateResult = await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        uploaderId: sellerId,
        categories: product.categories,
      },
    });

    return productCreateResult;
  }

  async getProducts({
    page,
    limit,
    query,
  }: {
    limit: number;
    page: number;
    query?: any;
  }) {
    const prisma: PrismaClient = this.prismaService.getPrismaClient();
    const _page = Math.max(page, 1);
    const _limit = limit > 100 ? 100 : Math.max(limit, 1);

    const products = await prisma.product.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
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

  async countProducts(query: any) {
    const prisma = this.prismaService.getPrismaClient();

    const totalProducts = await prisma.product.count({
      where: query,
    });
    return totalProducts;
  }

  async updateProduct(id: string, product: Omit<Partial<Product>, "id">) {
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
