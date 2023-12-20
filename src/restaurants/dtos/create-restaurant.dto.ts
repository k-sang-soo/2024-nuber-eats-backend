import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';

/* dto 에는 InputType과 ArgsType 이 존재함
 * InputType : GraphQL 쿼리나 뮤테이션에서 단일 인자로 전달되는 객체를 정의하는데 사용
 * ArgsType : 각각의 필드가 별도의 인자로 전달되는 객체를 정의하는 데 사용
 */
@ArgsType()
export class CreateRestaurantDto {
  @Field((type) => String)
  @IsString()
  @Length(5, 10)
  name: string;
  @Field((type) => Boolean)
  @IsBoolean()
  isVegan: boolean;
  @Field((type) => String)
  @IsString()
  address: string;
  @Field((type) => String)
  @IsString()
  ownerName: string;
}
