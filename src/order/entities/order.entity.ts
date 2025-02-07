import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class OrderItem{
  @Field(()=>String)
  productId:String
  @Field(()=>Int)
  quantity:number
}


@ObjectType()
export class Order {
  @Field(() => [OrderItem])
  orderItems: OrderItem[];
}
