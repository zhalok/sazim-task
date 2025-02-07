import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from '../entities/product.entity';

@ObjectType()
class Pagination {
  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  total: number;
}

@ObjectType()
export class ProductsOutput {
  @Field()
  pagination: Pagination;
  @Field(() => [Product])
  data: Product[];
}
