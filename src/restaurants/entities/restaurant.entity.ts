import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType() //자동으로 스키마를 빌드하기 위해 사용하는 GraphQL decorator
@Entity() // TypeORM이 DB에 저장하게 해주는 decorator
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number;

  @Field((type) => String)
  @Column()
  name: string;

  @Field((type) => Boolean)
  @Column()
  isVegan?: boolean;

  @Field((type) => String)
  @Column()
  address: string;

  @Field((type) => String)
  @Column()
  ownerName: string;

  @Field((type) => String)
  @Column()
  categoryName: string;
}
