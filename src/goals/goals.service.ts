import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './entities/goal.entity';
import { GoalStep } from './entities/goal-step.entity';
import { GoalStatus } from './enums/goal-status.enum';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalsRepo: Repository<Goal>,
    @InjectRepository(GoalStep)
    private readonly stepsRepo: Repository<GoalStep>,
  ) {}

  findAll(userId: string): Promise<Goal[]> {
    return this.goalsRepo.find({
      where: { userId },
      relations: ['steps'],
      order: { createdAt: 'DESC', steps: { position: 'ASC' } },
    });
  }

  async create(userId: string, dto: CreateGoalDto): Promise<Goal> {
    const hasSteps = dto.steps.length > 0;
    const steps = dto.steps.map((s, index) =>
      this.stepsRepo.create({
        title: s.title,
        deadline: new Date(s.deadline),
        status: index === 0 ? GoalStatus.Current : GoalStatus.Locked,
        position: index,
      }),
    );
    if (hasSteps) {
      steps.push(
        this.stepsRepo.create({
          title: dto.title,
          deadline: new Date(dto.deadline),
          status: GoalStatus.Locked,
          position: dto.steps.length,
        }),
      );
    }
    const goal = this.goalsRepo.create({
      title: dto.title,
      motivation: dto.motivation,
      deadline: new Date(dto.deadline),
      categories: dto.categories,
      status: hasSteps ? GoalStatus.Locked : GoalStatus.Current,
      userId,
      steps,
    });
    return this.goalsRepo.save(goal);
  }

  async update(id: string, userId: string, dto: UpdateGoalDto): Promise<Goal> {
    const existing = await this.findOneOwned(id, userId);

    const goalUpdates: Partial<Goal> = {};
    if (dto.title !== undefined) goalUpdates.title = dto.title;
    if (dto.motivation !== undefined) goalUpdates.motivation = dto.motivation;
    if (dto.deadline !== undefined)
      goalUpdates.deadline = new Date(dto.deadline);
    if (dto.categories !== undefined) goalUpdates.categories = dto.categories;

    if (dto.steps !== undefined) {
      await this.stepsRepo.delete({ goalId: id });
      const hasSteps = dto.steps.length > 0;
      goalUpdates.status = hasSteps ? GoalStatus.Locked : GoalStatus.Current;
      goalUpdates.dateAchieved = null;

      if (hasSteps) {
        const finalTitle = dto.title ?? existing.title;
        const finalDeadline = dto.deadline
          ? new Date(dto.deadline)
          : existing.deadline;
        const steps = dto.steps.map((s, index) =>
          this.stepsRepo.create({
            title: s.title,
            deadline: new Date(s.deadline),
            status: index === 0 ? GoalStatus.Current : GoalStatus.Locked,
            position: index,
            goalId: id,
          }),
        );
        steps.push(
          this.stepsRepo.create({
            title: finalTitle,
            deadline: finalDeadline,
            status: GoalStatus.Locked,
            position: dto.steps.length,
            goalId: id,
          }),
        );
        await this.stepsRepo.save(steps);
      }
    }

    if (Object.keys(goalUpdates).length > 0) {
      await this.goalsRepo.update({ id }, goalUpdates);
    }

    return this.findOneOwned(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const goal = await this.findOneOwned(id, userId);
    await this.goalsRepo.softRemove(goal);
  }

  async completeStep(
    goalId: string,
    stepId: string,
    userId: string,
  ): Promise<Goal> {
    const goal = await this.findOneOwned(goalId, userId);
    const steps = goal.steps;
    const completedIndex = steps.findIndex((s) => s.id === stepId);
    if (completedIndex === -1) throw new NotFoundException('Step not found');

    await this.stepsRepo.update(
      { id: stepId },
      { status: GoalStatus.Achieved, dateAchieved: new Date() },
    );

    const nextStep = steps[completedIndex + 1];
    if (nextStep) {
      await this.stepsRepo.update(
        { id: nextStep.id },
        { status: GoalStatus.Current },
      );
    } else {
      await this.goalsRepo.update(
        { id: goalId },
        { status: GoalStatus.Achieved, dateAchieved: new Date() },
      );
    }

    return this.findOneOwned(goalId, userId);
  }

  private async findOneOwned(id: string, userId: string): Promise<Goal> {
    const goal = await this.goalsRepo.findOne({
      where: { id, userId },
      relations: ['steps'],
      order: { steps: { position: 'ASC' } },
    });
    if (!goal) throw new NotFoundException('Goal not found');
    return goal;
  }
}
