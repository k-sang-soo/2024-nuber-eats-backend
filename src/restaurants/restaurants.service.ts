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
}
