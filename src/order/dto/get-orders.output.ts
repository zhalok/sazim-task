import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Pagination } from 'src/common/dtos/pagination.dto';
import { Order } from '../entities/order.entity';

@ObjectType()
class Orderdata {
  @Field(() => String)
  id: string;

  @Field(() => Float)
  totalAmount: number;

  @Field(() => String)
  status: string;
}

@ObjectType()
export class GetOrdersOutput {
  @Field(() => Pagination)
  pagination: Pagination;
  @Field(() => [Orderdata])
  data: Orderdata[];
}
