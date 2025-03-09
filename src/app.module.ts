import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import { KeyvAdapter } from '@apollo/utils.keyvadapter';
import { ErrorsAreMissesCache } from '@apollo/utils.keyvaluecache';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

const redisCache = new Keyv(new KeyvRedis('redis://user:pass@localhost:6379'));
const faultTolerantCache = new ErrorsAreMissesCache(
  new KeyvAdapter(redisCache),
);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      introspection: process.env.NODE_ENV !== 'production',
      playground: process.env.NODE_ENV !== 'production',
      hideSchemaDetailsFromClientErrors: process.env.NODE_ENV !== 'production',
      status400ForVariableCoercionErrors: true,
      cache: faultTolerantCache,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      formatError: (formattedError) => {
        if (
          formattedError?.extensions?.code ===
          ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
        ) {
          return {
            ...formattedError,
            message:
              "Your query doesn't match the schema. Try double-checking it!",
          };
        }
        return formattedError;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService], //AppResolver for GraphQL resolver
})
export class AppModule {}
