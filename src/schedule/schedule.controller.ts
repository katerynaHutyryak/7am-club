import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { JwtPayload } from '../auth/auth.guard';
import { CreateScheduleEventDto } from './dto/create-schedule-event.dto';
import { UpdateScheduleEventDto } from './dto/update-schedule-event.dto';
import { ScheduleEvent } from './entities/schedule-event.entity';

@Controller('schedule-events')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  findAll(@Request() req: { user: JwtPayload }): Promise<ScheduleEvent[]> {
    return this.scheduleService.findAll(req.user.sub);
  }

  @Post()
  create(
    @Request() req: { user: JwtPayload },
    @Body() dto: CreateScheduleEventDto,
  ): Promise<ScheduleEvent> {
    return this.scheduleService.create(req.user.sub, dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Request() req: { user: JwtPayload },
    @Body() dto: UpdateScheduleEventDto,
  ): Promise<ScheduleEvent> {
    return this.scheduleService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string,
    @Request() req: { user: JwtPayload },
  ): Promise<void> {
    return this.scheduleService.remove(id, req.user.sub);
  }
}
