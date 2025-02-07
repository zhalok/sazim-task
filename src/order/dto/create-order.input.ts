import {  Field, Int, InputType } from '@nestjs/graphql';

@InputType()
class InputOrderItem{
  @Field(()=>String)
  productId:String
  @Field(()=>Int)
  quantity:number
}


@InputType()
export class CreateOrderInput {
  @Field(() => [InputOrderItem])
  orderItems: InputOrderItem[];
}
