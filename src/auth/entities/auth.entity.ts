import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Auth {
  @Field(() => Int, { description: "Example field (placeholder)" })
  exampleField: number;
}
