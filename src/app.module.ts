import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // code first 방법: 코드를 기반으로 자동으로 스키마가 생성
      autoSchemaFile: true,
    }),
    RestaurantsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'jeonmin-a',
      password: 'test',
      database: 'nuber-eats',
      synchronize: true, //TypeORM이 데이터베이스에 연결할 때 데이터베이스를 너의 모듈의 현재 상태로 마이그레이션 한다는 뜻
      logging: true, //데이터베이스에 무슨 일이 일어나는지 표시
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
