import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsEmail, IsEnum } from 'class-validator';

enum UserRole {
  Client,
  Owner,
  Delivery,
}

//GraphQL에서 enum type 사용 방법
registerEnumType(UserRole, { name: 'UserRole' });

// InputType 는 입력 값(@Args)을 "User" 라는 입력 타입으로 받겠다는 의미
//isAbstract 는 GraphQL 스키마에 직접적으로 나타나지 않지만
// "User" 클래스가 "CoreEntity" 필드들을 상속 받아 사용
// 이렇게 하는 이유는 중복되는 설정을 관리하고 확장성 있는 구조를 만들기 위해 사용
@InputType({ isAbstract: true })
// ObjectType 은 reutrn 값을 "User"로 받겠다는 의미
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Column()
  @Field((type) => String)
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  @Field((type) => Boolean)
  verified: boolean;

  // BeforeInsert는 entity가 데이터베이스에 저장되기 전에 자동으로 실행되는 함수
  @BeforeInsert()
  // BeforeUpdate는 editPorfile 에서 User 데이터를 수정하기전에 실행 되는 함수
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
