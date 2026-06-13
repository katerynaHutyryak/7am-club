import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { Goal } from './entities/goal.entity';
import { GoalStep } from './entities/goal-step.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Goal, GoalStep])],
  controllers: [GoalsController],
  providers: [GoalsService],
})
export class GoalsModule {}
