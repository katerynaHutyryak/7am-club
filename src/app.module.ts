import { AppConfigModule } from './config.module';
import { DatabaseModule } from './database.module';
import { UsersModule } from './users/users.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [AppConfigModule, UsersModule, DatabaseModule],
  providers: [],
})
export class AppModule {}
