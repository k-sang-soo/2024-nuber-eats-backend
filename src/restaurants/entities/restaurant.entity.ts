import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType() //자동으로 스키마를 빌드하기 위해 사용하는 GraphQL decorator
@Entity() // TypeORM이 DB에 저장하게 해주는 decorator
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number;

  @Field((type) => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field((type) => Boolean, { defaultValue: true })
  @Column({ default: true })
  @IsOptional() // value가 누락 됐는 지 확인하고, 없다면 모든 validator을 무시함. 해당 필드를 보내거나 보내지 않을 수 있음
  @IsBoolean()
  isVegan?: boolean;

  @Field((type) => String)
  @Column()
  address: string;
}
