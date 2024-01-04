import { ArgsType, Field, InputType, OmitType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';
import { Restaurant } from '../entities/restaurant.entity';

/* dto 에는 InputType과 ArgsType 이 존재함
 * InputType : GraphQL 쿼리나 뮤테이션에서 단일 인자로 전달되는 객체를 정의하는데 사용
 * ArgsType : 각각의 필드가 별도의 인자로 전달되는 객체를 정의하는 데 사용
 */
@InputType()
export class CreateRestaurantDto extends OmitType(
  Restaurant,
  ['id'],
  InputType,
) {}
