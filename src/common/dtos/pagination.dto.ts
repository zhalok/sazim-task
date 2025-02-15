import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Pagination {
  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  total: number;
}
