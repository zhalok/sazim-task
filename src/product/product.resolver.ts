import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { ProductsOutput } from './dto/get-products.output';
import { ProductOutput } from './dto/product.output';
import { DeleteProductOutput } from './dto/delete-product.output';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => ProductOutput)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    const createdProduct = await this.productService.create(createProductInput);
    return {
      data: createdProduct,
    };
  }

  @Query(() => ProductsOutput, { name: 'products' })
  async findAll(
    @Args('limit', { type: () => Int }) limit: number,
    @Args('page', { type: () => Int }) page: number,
  ) {
    const { products, totalProducts } = await this.productService.findAll({
      page,
      limit,
    });
    return {
      pagination: {
        limit,
        page,
        total: totalProducts,
      },
      data: products,
    };
  }

  @Query(() => ProductOutput, { name: 'product' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    const product = await this.productService.findOne(id);
    return { data: product };
  }

  @Mutation(() => ProductOutput)
  async updateProduct(
    @Args('id', { type: () => String }) id: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    const updatedProduct = await this.productService.update(
      id,
      updateProductInput,
    );
    return {
      data: updatedProduct,
    };
  }

  @Mutation(() => DeleteProductOutput)
  async removeProduct(@Args('id', { type: () => String }) id: string) {
    const deletedProduct = await this.productService.remove(id);
    return {
      message: `deleted product ${deletedProduct.id} successfully`,
    };
  }
}
