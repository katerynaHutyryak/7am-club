import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReflectionsController } from './reflections.controller';
import { ReflectionsService } from './reflections.service';
import { Reflection } from './entities/reflection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reflection])],
  controllers: [ReflectionsController],
  providers: [ReflectionsService],
})
export class ReflectionsModule {}
