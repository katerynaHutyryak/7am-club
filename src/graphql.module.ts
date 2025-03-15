import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { ErrorsAreMissesCache } from '@apollo/utils.keyvaluecache';
import { KeyvAdapter } from '@apollo/utils.keyvadapter';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';

const redisCache = new Keyv(new KeyvRedis('redis://user:pass@localhost:6379'));
const faultTolerantCache = new ErrorsAreMissesCache(
  new KeyvAdapter(redisCache),
);

@Module({
  imports: [
    ConfigModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        driver: ApolloDriver,
        introspection: configService.get<string>('NODE_ENV') !== 'production',
        playground: configService.get<string>('NODE_ENV') !== 'production',
        hideSchemaDetailsFromClientErrors:
          configService.get<string>('NODE_ENV') !== 'production',
        status400ForVariableCoercionErrors: true,
        cache: faultTolerantCache,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        formatError: (formattedError) => {
          if (
            formattedError?.extensions?.code === 'GRAPHQL_VALIDATION_FAILED'
          ) {
            return {
              ...formattedError,
              message: "Your query doesn't match the schema. Check it!",
            };
          }
          return formattedError;
        },
      }),
    }),
  ],
  exports: [GraphQLModule],
})
export class GraphQLConfigModule {}
