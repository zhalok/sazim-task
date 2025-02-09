import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from '../entities/product.entity';
import { Pagination } from 'src/common/dtos/pagination.dto';

@ObjectType()
export class ProductsOutput {
  @Field()
  pagination: Pagination;
  @Field(() => [Product])
  data: Product[];
}
