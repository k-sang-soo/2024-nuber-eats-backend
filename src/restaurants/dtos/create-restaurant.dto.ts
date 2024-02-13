'class-validator';
import { InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { Restaurant } from '../entities/restaurant.entity';
import { CoreOutput } from 'src/common/dtos/core-output.dto';

/* dto 에는 InputType과 ArgsType 이 존재함
 * InputType : GraphQL 쿼리나 뮤테이션에서 단일 인자로 전달되는 객체를 정의하는데 사용
 * ArgsType : 각각의 필드가 별도의 인자로 전달되는 객체를 정의하는 데 사용
 */
@InputType()
export class CreateRestaurantInput extends OmitType(Restaurant, [
  'id',
  'category',
  'owner',
]) {}

@ObjectType()
export class CreateRestaurantOut extends CoreOutput {}
