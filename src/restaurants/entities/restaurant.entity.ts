import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';
import { User } from 'src/users/entities/users.entity';

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType() // 자동으로 스키마를 빌드하기 위해 사용하는 GraphQL decorator
@Entity() // TypeORM이 DB에 저장하게 해주는 decorator
export class Restaurant extends CoreEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number;

  @Field((type) => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  coverImg: string;

  @Field((type) => String)
  @Column()
  address: string;

  // 하나의 restaurant 는 여러개의 category를 가지고 있음
  // nullable : category 를 지울 때 restaurant를 지우면 안되기 때문
  // onDelete: 참조된 객체가 삭제될 때, 외래 키(foreign key)가 어떻게 작동해야 하는 지 지정
  @Field((type) => Category, { nullable: true })
  @ManyToOne((type) => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;

  // owner 이 사라지면 restaurant도 같이 사라져야하기 떄문에 nullable 은 false
  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.restaurants)
  owner: User;
}
