import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreatePaymentInput {
  @Field(() => String)
  id: string;
}
