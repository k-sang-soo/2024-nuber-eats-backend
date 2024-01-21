import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './users.entity';
import { v4 as uuidv4 } from 'uuid';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
// verification 을 만들어서 사용하는 이유는 보안상의 이유로
// 사용자의 개인 정보를 직접 노출시키지 않고 인증 코드를 사용하는 방식
export class Verification extends CoreEntity {
  @Column()
  @Field((types) => String)
  code: string;

  // one-to-one 관계
  // A가 오로지 하나의 B만 포함하고 B 또한 하나의 A만 포함
  // Verification 은 오로지 하나의 User만 가질 수 있고
  // User도 외직 하나의 Verification만 가질 수 있다
  //JoinColumn은 필수 값으로 기준이 되고 싶은 곳에 적으면 됨

  // onDelete 란 "user"가 삭제 되었을 때의 동작을 정의
  // CASCADE는 user와 붙어있는 verification도 같이 삭제한다는 의미
  @OneToOne((type) => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  // Verification 테이블에 userId 라는 외래 키 컬럼이 추가 된 이유는
  // User 테이블의 기본 키('id')와 연결되어, Verification이 어떤 User와 연결되어있는지를 나타내줌
  user: User;

  // 다른 곳에서도 생성할 수 있게 hook으로 뺌
  @BeforeInsert()
  createCode(): void {
    this.code = uuidv4();
  }
}
