import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reflection as ReflectionEntity } from './entities/reflection.entity';
import { Reflection } from './reflection.type';
import { CreateReflectionDto } from './dto/create-reflection.dto';
import { UpdateReflectionDto } from './dto/update-reflection.dto';

@Injectable()
export class ReflectionsService {
  constructor(
    @InjectRepository(ReflectionEntity)
    private readonly reflectionsRepo: Repository<ReflectionEntity>,
  ) {}

  findAll(userId: string): Promise<Reflection[]> {
    return this.reflectionsRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  create(userId: string, dto: CreateReflectionDto): Promise<Reflection> {
    const reflection = this.reflectionsRepo.create({ ...dto, userId });
    return this.reflectionsRepo.save(reflection);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateReflectionDto,
  ): Promise<Reflection> {
    const reflection = await this.findOneOwnedOrError(id, userId);
    Object.assign(reflection, dto);
    return this.reflectionsRepo.save(reflection);
  }

  async remove(id: string, userId: string): Promise<void> {
    const reflection = await this.findOneOwnedOrError(id, userId);
    await this.reflectionsRepo.softRemove(reflection);
  }

  private async findOneOwnedOrError(
    id: string,
    userId: string,
  ): Promise<ReflectionEntity> {
    const reflection = await this.reflectionsRepo.findOne({
      where: { id, userId },
    });
    if (!reflection) throw new NotFoundException('Reflection not found');
    return reflection;
  }
}
