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
import { BlogService } from './blog.service';
import { JwtPayload } from '../auth/auth.guard';
import { Public } from '../auth/public.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as BlogPost } from './entities/post.entity';

@Controller('posts')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Public()
  @Get()
  findAll(): Promise<BlogPost[]> {
    return this.blogService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string): Promise<BlogPost> {
    return this.blogService.findOne(id);
  }

  @Post()
  create(
    @Request() req: { user: JwtPayload },
    @Body() dto: CreatePostDto,
  ): Promise<BlogPost> {
    return this.blogService.create(req.user.sub, dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Request() req: { user: JwtPayload },
    @Body() dto: UpdatePostDto,
  ): Promise<BlogPost> {
    return this.blogService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string,
    @Request() req: { user: JwtPayload },
  ): Promise<void> {
    return this.blogService.remove(id, req.user.sub);
  }
}
