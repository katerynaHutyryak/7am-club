import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleEvent } from './entities/schedule-event.entity';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleEvent])],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
