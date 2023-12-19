import { Query, Resolver } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entity';

@Resolver()
export class RestaurantsResolver {
  // Query가 return 하고자 하는 type을 return 하는 function이어여 한다.
  @Query(() => Restaurant)
  myRestaurant() {
    return true;
  }
}
