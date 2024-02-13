import { RestaurantService } from './restaurants.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entity';
import {
  CreateRestaurantInput,
  CreateRestaurantOut,
} from './dtos/create-restaurant.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/users.entity';

@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  //service에서 repository를 사용하기 위해 불러옴
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation(() => CreateRestaurantOut)
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOut> {
    return await this.restaurantService.createRestaurant(
      authUser,
      createRestaurantInput,
    );
  }
}
