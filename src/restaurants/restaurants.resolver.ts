import { RestaurantService } from './restaurants.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant';

@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  //service에서 repository를 사용하기 위해 불러옴
  constructor(private readonly restaurantService: RestaurantService) {}
  // Query가 return 하고자 하는 type을 return 하는 function이어여 한다.
  // [Restaurant] 괄호 안에 넣는 방식이 GraphQL에서 배열을 표현하는 방법
  @Query(() => [Restaurant])
  // GraphQL에서 args 전달 방법
  restaurant(): Promise<Restaurant[]> {
    return this.restaurantService.getAll();
  }
  @Mutation(() => Boolean)
  async createRestaurant(
    @Args('input') createRestaurantDto: CreateRestaurantDto,
  ): Promise<boolean> {
    try {
      // resolver에서 service의 메서드를 호출하여 서비스에 정의된 비즈니스 로직을 실행하는 역할.
      // 이 과정에서 resolver은 클라이언트로부터 받은 데이터를 서비스에 전달함
      await this.restaurantService.createRestaurant(createRestaurantDto);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  @Mutation((returns) => Boolean)
  async updateRestaurant(
    @Args('input') updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<boolean> {
    try {
      await this.restaurantService.updateRestaurant(updateRestaurantDto);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
