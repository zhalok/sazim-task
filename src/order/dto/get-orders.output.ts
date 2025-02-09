import { Field, ObjectType } from '@nestjs/graphql';
import { Pagination } from 'src/common/dtos/pagination.dto';
import { Order } from '../entities/order.entity';

@ObjectType()
export class GetOrdersOutput {
  @Field(() => Pagination)
  pagination: Pagination;
  @Field(() => [Order])
  data: Order[];
}
