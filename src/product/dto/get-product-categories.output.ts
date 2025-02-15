import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ProductCategory {
  @Field()
  label: string;

  @Field()
  value: string;
}
@ObjectType()
export class ProductsCategoriesOutput {
  @Field(() => [ProductCategory])
  categories: ProductCategory[];
}
