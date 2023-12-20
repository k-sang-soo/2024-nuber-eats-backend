import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';

@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  // Query가 return 하고자 하는 type을 return 하는 function이어여 한다.
  // [Restaurant] 괄호 안에 넣는 방식이 GraphQL에서 배열을 표현하는 방법
  @Query(() => [Restaurant])
  // GraphQL에서 args 전달 방법
  restaurant(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
    return [];
  }
  @Mutation(() => Boolean)
  createRestaurant(@Args() createRestaurantDto: CreateRestaurantDto): boolean {
    return true;
  }
}
