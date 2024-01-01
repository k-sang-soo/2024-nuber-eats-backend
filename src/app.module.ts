import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 어디서나 config 모듈에 접근할 수 있게하는 지
      envFilePath: process.env.NODE_ENV === 'dev' ? '.dev.env' : '.test.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // code first 방법: 코드를 기반으로 자동으로 스키마가 생성
      autoSchemaFile: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'jeonmin-a',
      password: '1111',
      database: 'nuber-eats',
      synchronize: true, //TypeORM이 데이터베이스에 연결할 때 데이터베이스를 너의 모듈의 현재 상태로 마이그레이션 한다는 뜻
      logging: true, //데이터베이스에 무슨 일이 일어나는지 표시
    }),
    RestaurantsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
