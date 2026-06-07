import { AppConfigModule } from './config.module';
import { DatabaseModule } from './database.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AppConfigModule, UsersModule, DatabaseModule, AuthModule],
  providers: [],
})
export class AppModule {}
