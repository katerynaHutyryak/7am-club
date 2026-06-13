import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { JwtPayload } from '../auth/auth.guard';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  findAll(@Request() req: { user: JwtPayload }): Promise<Goal[]> {
    return this.goalsService.findAll(req.user.sub);
  }

  @Post()
  create(
    @Request() req: { user: JwtPayload },
    @Body() dto: CreateGoalDto,
  ): Promise<Goal> {
    return this.goalsService.create(req.user.sub, dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Request() req: { user: JwtPayload },
    @Body() dto: UpdateGoalDto,
  ): Promise<Goal> {
    return this.goalsService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string,
    @Request() req: { user: JwtPayload },
  ): Promise<void> {
    return this.goalsService.remove(id, req.user.sub);
  }

  @Patch(':id/steps/:stepId/complete')
  @HttpCode(HttpStatus.OK)
  completeStep(
    @Param('id') id: string,
    @Param('stepId') stepId: string,
    @Request() req: { user: JwtPayload },
  ): Promise<Goal> {
    return this.goalsService.completeStep(id, stepId, req.user.sub);
  }
}
