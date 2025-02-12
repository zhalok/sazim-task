import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class OrderItem {
  @Field(() => String)
  productId: String;
  @Field(() => Int)
  quantity: number;
}

@ObjectType()
export class Order {
  @Field(() => String)
  id: string;

  @Field(() => [OrderItem])
  orderItems: OrderItem[];

  @Field(() => String)
  customerEmail: string;

  @Field(() => Float)
  totalAmount: number;

  @Field(() => String)
  status: string;
}
