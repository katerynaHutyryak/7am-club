import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleEvent } from './entities/schedule-event.entity';
import { CreateScheduleEventDto } from './dto/create-schedule-event.dto';
import { UpdateScheduleEventDto } from './dto/update-schedule-event.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ScheduleEvent)
    private readonly eventsRepo: Repository<ScheduleEvent>,
  ) {}

  findAll(userId: string): Promise<ScheduleEvent[]> {
    return this.eventsRepo.find({
      where: { userId },
      order: { start: 'ASC' },
    });
  }

  create(userId: string, dto: CreateScheduleEventDto): Promise<ScheduleEvent> {
    const event = this.eventsRepo.create({
      ...dto,
      start: new Date(dto.start),
      end: new Date(dto.end),
      userId,
    });
    return this.eventsRepo.save(event);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateScheduleEventDto,
  ): Promise<ScheduleEvent> {
    const event = await this.findOneOwned(id, userId);
    const { start, end, ...rest } = dto;
    Object.assign(event, rest);
    if (start !== undefined) event.start = new Date(start);
    if (end !== undefined) event.end = new Date(end);
    return this.eventsRepo.save(event);
  }

  async remove(id: string, userId: string): Promise<void> {
    const event = await this.findOneOwned(id, userId);
    await this.eventsRepo.softRemove(event);
  }

  private async findOneOwned(
    id: string,
    userId: string,
  ): Promise<ScheduleEvent> {
    const event = await this.eventsRepo.findOne({ where: { id, userId } });
    if (!event) throw new NotFoundException('Schedule event not found');
    return event;
  }
}
