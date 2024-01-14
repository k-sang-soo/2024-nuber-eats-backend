import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { User } from './users/entities/users.entity';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleWare } from './jwt/jwt.middleware';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 어디서나 config 모듈에 접근할 수 있게하는지
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod', //서버에 deploy 할 때 환경변수 파일을 사용할껀지
      validationSchema: Joi.object({
        // 환경변수 유효성 검사
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // code first 방법: 코드를 기반으로 자동으로 스키마가 생성
      autoSchemaFile: true,
      // context: 각 GraphQL 요청에 대한 컨텍스트 정보를 설정
      // 이를 통해 리졸버 내에서 컨테스트 정보에 접근할 수 있음
      context: ({ req }) => ({ user: req['user'] }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'prod', //TypeORM이 데이터베이스에 연결할 때 데이터베이스를 너의 모듈의 현재 상태로 마이그레이션 한다는 뜻
      logging: process.env.NODE_ENV !== 'prod', //데이터베이스에 무슨 일이 일어나는지 표시
      entities: [User],
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    UsersModule,
    JwtModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})

// 미들웨어 설정
// AppModule 클래스에서 NestModule 인터페이스를 사용함으로써, 미들웨어를 설정
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleWare).forRoutes({
      path: '/graphql', // * 를 입력하면 모든 경로에 적용
      method: RequestMethod.ALL, // RequestMethod.ALL 을 하면 모든 HTTP 요청에 적용
    });
  }
}
