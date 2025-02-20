import { HttpException, HttpStatus, UseGuards } from "@nestjs/common";
import { Args, Context, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Role } from "@prisma/client";
import { Roles } from "src/common/decorators/role.decorator";
import { GqlAuthGuard } from "src/common/guards/auth.guard";
import { RolesGuard } from "src/common/guards/role.guard";
import { productCategories } from "./constants";
import { CreateProductInput } from "./dto/create-product.input";
import { DeleteProductOutput } from "./dto/delete-product.output";
import { FilterProducts } from "./dto/filter-products.input";
import { ProductsCategoriesOutput } from "./dto/get-product-categories.output";
import { ProductsOutput } from "./dto/get-products.output";
import { ProductOutput } from "./dto/product.output";
import { UpdateProductInput } from "./dto/update-product.input";
import { Product } from "./entities/product.entity";
import { ProductService } from "./product.service";

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => ProductOutput)
  @Roles(Role.SELLER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async createProduct(
    @Args("createProductInput") createProductInput: CreateProductInput,
    @Context() context: any,
  ) {
    const { sellerId } = context.req.user;

    if (!sellerId) {
      throw new HttpException("Unauthorized access", HttpStatus.UNAUTHORIZED);
    }
    const createdProduct = await this.productService.create(
      createProductInput,
      sellerId,
    );
    return {
      data: createdProduct,
    };
  }

  @Roles(Role.SELLER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Query(() => ProductsOutput, { name: "myProducts" })
  async getMyProducts(
    @Args("limit", { type: () => Int }) limit: number,
    @Args("page", { type: () => Int }) page: number,
    @Context() context: any,
  ) {
    const { sellerId } = context.req.user;

    if (!sellerId) {
      throw new HttpException("Unauthorized access", HttpStatus.UNAUTHORIZED);
    }
    const { products, totalProducts } = await this.productService.findAll({
      limit,
      page,
      filter: {
        sellerId,
      },
    });
    console.log("products", products);
    return {
      pagination: {
        limit,
        page,
        total: totalProducts,
      },
      data: products,
    };
  }

  @Query(() => ProductsCategoriesOutput, { name: "productCategories" })
  async getProductCategories(): Promise<ProductsCategoriesOutput> {
    console.log(productCategories);
    return {
      categories: productCategories,
    };
  }
  @Query(() => ProductsOutput, { name: "products" })
  async findAll(
    @Args("limit", { type: () => Int }) limit: number,
    @Args("page", { type: () => Int }) page: number,
    @Args("filter", { type: () => FilterProducts, nullable: true })
    filter?: FilterProducts,
  ) {
    const { products, totalProducts } = await this.productService.findAll({
      page,
      limit,
      filter: {
        name: filter?.name,
        categories: filter?.categories,
      },
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

  @Query(() => ProductOutput, { name: "product" })
  async findOne(@Args("id", { type: () => String }) id: string) {
    const product = await this.productService.findOne(id);
    return { data: product };
  }

  @Mutation(() => ProductOutput)
  async updateProduct(
    @Args("id", { type: () => String }) id: string,
    @Args("updateProductInput") updateProductInput: UpdateProductInput,
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
  async removeProduct(@Args("id", { type: () => String }) id: string) {
    const deletedProduct = await this.productService.remove(id);
    return {
      message: `deleted product ${deletedProduct.id} successfully`,
    };
  }
}
