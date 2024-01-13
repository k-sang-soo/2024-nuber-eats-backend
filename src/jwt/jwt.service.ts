import { CONFIG_OPTIONS } from './jwt.constants';
import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interfaces';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS)
    private readonly options: JwtModuleOptions, // configService로 해결할 수 있지만 연습을 위해서 JwtModuleOptions 사용 // private readonly configService: ConfigService
  ) {
    console.log(options);
  }
  sign(userID: number): string {
    // configService로 해결할 수 있지만 연습을 위해서 JwtModuleOptions 사용 // private readonly configService: ConfigService
    // return jwt.sign(payload, this.configService.get('PRIVATE_KEY'));
    return jwt.sign({ id: userID }, this.options.privateKey);
  }
  verit(token: string) {
    return jwt.verify(token, this.options.privateKey);
  }
}
