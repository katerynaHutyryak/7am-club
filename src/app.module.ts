import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database.module';
import { GraphQLConfigModule } from './graphql.module';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';

@Module({
  imports: [AppConfigModule, DatabaseModule, GraphQLConfigModule],
  controllers: [UsersController],
  providers: [AppService], //AppResolver for GraphQL resolver
})
export class AppModule {}
