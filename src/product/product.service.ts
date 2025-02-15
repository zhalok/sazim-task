import { Injectable } from "@nestjs/common";
import { CreateProductInput } from "./dto/create-product.input";
import { FilterProducts } from "./dto/filter-products.input";
import { UpdateProductInput } from "./dto/update-product.input";
import { ProductRepository } from "./product.repository";

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
        categories: createProductInput.categories,
      },
      sellerId,
    );
    return product;
  }

  async findAll({
    limit,
    page,
    filter,
  }: {
    limit: number;
    page: number;
    filter?: FilterProducts;
  }) {
    const query = {};
    if (filter.name) {
      query["name"] = {
        contains: filter.name,
      };
    }

    if (filter.categories) {
      query["categories"] = {
        hasSome: filter.categories,
      };
    }
    if (filter.sellerId) {
      query["uploaderId"] = filter.sellerId;
    }
    const totalProducts = await this.productRepository.countProducts(query);
    const products = await this.productRepository.getProducts({
      limit,
      page,
      query,
    });
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
