import { Field, Int, InputType } from '@nestjs/graphql';
import { OrderType } from '@prisma/client';

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

  @Field(() => String, { defaultValue: OrderType.PURCHASE })
  orderType: OrderType;

  @Field(() => Int, { nullable: true })
  rentPeriodInDays?: number;
}
