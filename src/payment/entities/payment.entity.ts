import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Payment {
  @Field(() => String)
  paymentId: string;

  @Field(() => Int)
  amount: number;

  @Field(() => String)
  status: string;

  @Field(() => String)
  orderId: string;

  @Field(() => String, { nullable: true })
  rentExpireAt?: string;
}
