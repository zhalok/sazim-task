import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { LoginInput } from './dto/login.input';
import { LoginOutput } from './dto/login.output';
import { AuthMeOutput } from './dto/auth-me.output';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { RolesGuard } from 'src/common/guards/role.guard';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginOutput)
  login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Query(() => AuthMeOutput)
  @Roles('SELLER')
  @UseGuards(GqlAuthGuard,RolesGuard)
  authMe() {
    return {
      valid:true
    };
  }
  
}
