import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { JwtModuleOptions } from './jwt.interfaces';
import { CONFIG_OPTIONS } from 'src/common/common.constants';

@Module({})
@Global()
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      providers: [
        {
          // // provide 는 다른 서비스에서 options(JwtModuleOptions) 을 사용하려고 할 때
          // CONFIG_OPTIONS.jwt 토큰을 통해 주입받을 수 있다/
          provide: CONFIG_OPTIONS.jwt,
          // 실제로 주입될 값. JwtModule.forRoot()에 전달된 options 객체
          useValue: options,
        },
        // 여기에 JwtService 가 추가된 건 해당 모듈 내의 다른 클래스에서 주입받아 사용할 수 있게 하기 위해서
        JwtService,
      ],
      // 이 모듈이 JwtModule 뿐만 아니라 다른 모듈에서도 사용되어야 한다면 exports에 포함 시켜야 함
      exports: [JwtService],
    };
  }
}
