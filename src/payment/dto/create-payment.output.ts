import { Field, ObjectType } from "@nestjs/graphql";
import { OrderStatus, PaymentStatus } from "@prisma/client";

@ObjectType()
export class MakePaymentOutput {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => String, { nullable: true })
  orderId?: string;

  @Field(() => String, { nullable: true })
  paymentStatus?: PaymentStatus;

  @Field(() => String, { nullable: true })
  orderStatus?: OrderStatus;
}
