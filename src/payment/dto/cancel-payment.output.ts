import { Field, ObjectType } from "@nestjs/graphql";
import { OrderStatus, PaymentStatus } from "@prisma/client";

@ObjectType()
export class CancelPaymentOutput {
  @Field(() => String)
  paymentStatus: PaymentStatus;

  @Field(() => String)
  orderStatus: OrderStatus;

  @Field(() => String)
  orderId: string;
}
