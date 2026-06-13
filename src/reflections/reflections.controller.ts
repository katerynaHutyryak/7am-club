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
import { ReflectionsService } from './reflections.service';
import { JwtPayload } from '../auth/auth.guard';
import { CreateReflectionDto } from './dto/create-reflection.dto';
import { UpdateReflectionDto } from './dto/update-reflection.dto';
import { ReflectionResponseDto } from './dto/reflection-response.dto';

@Controller('reflections')
export class ReflectionsController {
  constructor(private readonly reflectionsService: ReflectionsService) {}

  @Get()
  async findAll(
    @Request() req: { user: JwtPayload },
  ): Promise<ReflectionResponseDto[]> {
    const reflections = await this.reflectionsService.findAll(req.user.sub);
    return reflections.map(
      (reflection) => new ReflectionResponseDto(reflection),
    );
  }

  @Post()
  async create(
    @Request() req: { user: JwtPayload },
    @Body() dto: CreateReflectionDto,
  ): Promise<ReflectionResponseDto> {
    const reflection = await this.reflectionsService.create(req.user.sub, dto);
    return new ReflectionResponseDto(reflection);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Request() req: { user: JwtPayload },
    @Body() dto: UpdateReflectionDto,
  ): Promise<ReflectionResponseDto> {
    const reflection = await this.reflectionsService.update(
      id,
      req.user.sub,
      dto,
    );
    return new ReflectionResponseDto(reflection);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string,
    @Request() req: { user: JwtPayload },
  ): Promise<void> {
    return this.reflectionsService.remove(id, req.user.sub);
  }
}
