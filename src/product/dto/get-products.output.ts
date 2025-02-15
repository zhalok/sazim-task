import { Field, ObjectType } from "@nestjs/graphql";
import { Pagination } from "src/common/dtos/pagination.dto";
import { Product } from "../entities/product.entity";

@ObjectType()
export class ProductsOutput {
  @Field()
  pagination: Pagination;
  @Field(() => [Product])
  data: Product[];
}
