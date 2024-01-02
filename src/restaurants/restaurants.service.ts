import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Injectable } from '@nestjs/common';
import { Restaurant } from './entities/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantService {
  constructor(
    // restaurant entity의 repository를 inject
    // 이름은 restaurants이고 class는 Restaurant entity를 가진 Repository
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}
  getAll(): Promise<Restaurant[]> {
    // 이렇게 Repository를 접근할 수 있음
    return this.restaurants.find();
  }
  createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    // create는 새 엔티티 인스턴스를 만들고 이 개체의 모든 엔터티 속성을 새 엔티티에 복사. 엔터티 스키마에 있는 속성만 복사
    // save는 엔티티를 데이터베이스에 저장 또는 업데이트, 데이터베이스에 지정된 모든 엔터티를 저장. 엔티티가 데이터베이스에 없으면 삽입하고, 그렇지 않으면 업데이트.
    const newRestaurant = this.restaurants.create(createRestaurantDto);
    return this.restaurants.save(newRestaurant);
  }
}
