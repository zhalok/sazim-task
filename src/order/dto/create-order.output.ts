import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrderData {
  @Field(() => String)
  id: string;
  @Field(() => Float)
  totalPayableAmount: number;
  @Field(() => String)
  status: string;
  @Field(() => String)
  paymentId: string;
}

@ObjectType()
export class CreateOrderOutput {
  @Field(()=>OrderData)
  data: OrderData;
}
