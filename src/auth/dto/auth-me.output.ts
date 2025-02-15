import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AuthMeOutput {
  @Field(() => Boolean)
  valid: boolean;
}
