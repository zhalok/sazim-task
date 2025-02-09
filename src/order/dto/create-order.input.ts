import { Field, Int, InputType } from '@nestjs/graphql';

@InputType()
class InputOrderItem {
  @Field(() => String)
  productId: String;
  @Field(() => Int)
  quantity: number;
}

@InputType()
export class CreateOrderInput {
  @Field(() => String)
  customerEmail: string;

  @Field(() => String)
  customerPhone: string;

  @Field(() => [InputOrderItem])
  orderItems: InputOrderItem[];
}
