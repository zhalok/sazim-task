import { Field, Float, InputType, Int, PartialType } from "@nestjs/graphql";
import { CreateProductInput } from "./create-product.input";

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  stock: number;
}
