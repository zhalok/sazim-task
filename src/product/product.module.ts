import { Module } from "@nestjs/common";
import { ProductRepository } from "./product.repository";
import { ProductResolver } from "./product.resolver";
import { ProductService } from "./product.service";

@Module({
  providers: [ProductResolver, ProductService, ProductRepository],
  exports: [ProductService, ProductResolver],
})
export class ProductModule {}
