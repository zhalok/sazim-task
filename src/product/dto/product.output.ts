import { Field, ObjectType } from "@nestjs/graphql";
import { Product } from "../entities/product.entity";

@ObjectType()
export class ProductOutput {
  @Field()
  data: Product;
}
