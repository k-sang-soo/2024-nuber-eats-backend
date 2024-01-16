import { UsersService } from './users.service';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { User } from './entities/users.entity';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserProfileInput, UserProfileOutPut } from './dtos/user-profile.dto';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation((returns) => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      return this.usersService.createAccount(createAccountInput);
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  @Mutation((returns) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      return this.usersService.login(loginInput);
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  @Query((returns) => User)
  // AuthGuard는 reuqest를 처리하리 전에 실행되고 reuqest 요청을 넘겨줄지만 판단
  // AuthGuard를 통과하고 AuthUser를 통해서 매개변수로 context의 값을 받아옴
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @Query((returns) => UserProfileOutPut)
  @UseGuards(AuthGuard)
  async userProfile(
    @Args() userProFileInput: UserProfileInput,
  ): Promise<UserProfileOutPut> {
    try {
      const user = await this.usersService.findById(userProFileInput.userId);
      if (!user) throw Error();
      return {
        ok: true,
        user,
      };
    } catch (e) {
      return {
        ok: false,
        error: 'User Not Found',
      };
    }
  }
}
