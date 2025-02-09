import { Field, InputType } from '@nestjs/graphql';
import { OrderStatus } from '@prisma/client';

@InputType()
export class GetOrdersFilter {
  @Field(() => String, { nullable: true })
  customerEmail: string;

  @Field(() => String, { nullable: true })
  status: string;

  @Field(() => Date, { nullable: true })
  createdAt: Date;
}
