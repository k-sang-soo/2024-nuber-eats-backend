import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { RestaurnatsModule } from './restaurnats/restaurnats.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'scr/schema.gql'),
    }),
    RestaurnatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
