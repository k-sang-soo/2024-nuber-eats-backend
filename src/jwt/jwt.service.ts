import { CONFIG_OPTIONS } from './jwt.constants';
import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interfaces';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS)
    private readonly options: JwtModuleOptions, // configService로 해결할 수 있지만 연습을 위해서 JwtModuleOptions 사용 // private readonly configService: ConfigService
  ) {}
  sign(userID: number): string {
    // configService로 해결할 수 있지만 연습을 위해서 JwtModuleOptions 사용 // private readonly configService: ConfigService
    // return jwt.sign(payload, this.configService.get('PRIVATE_KEY'));
    return jwt.sign({ id: userID }, this.options.privateKey);
  }
  verit(token: string) {
    // 토큰의 무결성 검증 또는 만료 확인
    // return 값으 토큰안에 정보(payload)를 디코드하여 반환
    // 디코드란 어떤 데이터를 원래의 형태나 형식으로 변환하는 과정을 의미
    return jwt.verify(token, this.options.privateKey);
  }
}
