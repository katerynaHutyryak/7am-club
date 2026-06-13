import { AppConfigModule } from './config.module';
import { DatabaseModule } from './database.module';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GoalsModule } from './goals/goals.module';
import { ReflectionsModule } from './reflections/reflections.module';
import { BlogModule } from './blog/blog.module';
import { BubblesModule } from './bubbles/bubbles.module';
import { ScheduleModule } from './schedule/schedule.module';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    AppConfigModule,
    ThrottlerModule.forRoot([{ name: 'global', ttl: 60000, limit: 100 }]),
    UsersModule,
    DatabaseModule,
    AuthModule,
    GoalsModule,
    ReflectionsModule,
    BlogModule,
    BubblesModule,
    ScheduleModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}
