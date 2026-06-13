import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BubblesController } from './bubbles.controller';
import { BubblesService } from './bubbles.service';
import { Bubble } from './entities/bubble.entity';
import { Message } from './entities/message.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bubble, Message, User])],
  controllers: [BubblesController],
  providers: [BubblesService],
})
export class BubblesModule {}
