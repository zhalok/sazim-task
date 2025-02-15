import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class FilterProducts {
  @Field({ nullable: true })
  name?: string;

  @Field(() => [String], { nullable: true })
  categories?: string[];

  @Field(() => [String], { nullable: true })
  sellerId?: string;
}
