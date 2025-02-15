import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Roles } from "src/common/decorators/role.decorator";
import { GqlAuthGuard } from "src/common/guards/auth.guard";
import { RolesGuard } from "src/common/guards/role.guard";
import { AuthService } from "./auth.service";
import { AuthMeOutput } from "./dto/auth-me.output";
import { LoginInput } from "./dto/login.input";
import { LoginOutput } from "./dto/login.output";
import { Auth } from "./entities/auth.entity";

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginOutput)
  login(@Args("loginInput") loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Query(() => AuthMeOutput)
  @Roles("SELLER")
  @UseGuards(GqlAuthGuard, RolesGuard)
  authMe() {
    return {
      valid: true,
    };
  }
}
