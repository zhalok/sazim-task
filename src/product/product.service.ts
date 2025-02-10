import { Injectable } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { ProductRepository } from './product.repository';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}
  async create(createProductInput: CreateProductInput, sellerId: string) {
    const product = await this.productRepository.createProduct(
      {
        name: createProductInput.name,
        description: createProductInput.description,
        price: createProductInput.price,
        stock: createProductInput.stock,
      },
      sellerId,
    );
    return product;
  }

  async findAll({
    limit,
    page,
  }: {
    limit: number;
    page: number;
    filter?: Partial<Product & { id: string }>;
  }) {
    const totalProducts = await this.productRepository.countProducts({});
    const products = await this.productRepository.getProducts({ limit, page });
    return { products, totalProducts };
  }

  async findOne(id: string) {
    const product = await this.productRepository.getProductById(id);
    return product;
  }

  async update(id: string, updateProductInput: UpdateProductInput) {
    const updatedProduct = await this.productRepository.updateProduct(
      id,
      updateProductInput,
    );
    return updatedProduct;
  }

  async remove(id: string) {
    const deletedProduct = await this.productRepository.removeProduct(id);
    return deletedProduct;
  }
}
