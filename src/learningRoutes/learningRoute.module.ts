import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningRoute } from './entities/learningRoute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LearningRoute])],
  providers: [],
  controllers: [],
})
export class UsersModule {}
