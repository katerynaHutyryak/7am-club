import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database.module';
import { GraphQLConfigModule } from './graphql.module';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [AppConfigModule, GraphQLConfigModule, UsersModule, DatabaseModule],
  controllers: [UsersController],
  providers: [AppService], //AppResolver for GraphQL resolver
})
export class AppModule {}
