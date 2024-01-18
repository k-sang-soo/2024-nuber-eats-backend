import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './users.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column()
  @Field((types) => String)
  code: string;

  // one-to-one 관계
  // A가 오로지 하나의 B만 포함하고 B 또한 하나의 A만 포함
  // Verification 은 오로지 하나의 User만 가질 수 있고
  // User도 외직 하나의 Verification만 가질 수 있다
  //JoinColumn은 필수 값으로 기준이 되고 싶은 곳에 적으면 됨
  @OneToOne((type) => User)
  @JoinColumn()
  user: User;
}
