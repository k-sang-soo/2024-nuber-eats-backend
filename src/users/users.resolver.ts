import { UsersService } from './users.service';
import { Resolver, Query } from '@nestjs/graphql';
import { User } from './entities/users.entity';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => Boolean)
  hi() {
    return true;
  }
}
