import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepo: Repository<Post>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postsRepo.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepo.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  create(authorId: string, dto: CreatePostDto): Promise<Post> {
    const post = this.postsRepo.create({ ...dto, authorId });
    return this.postsRepo.save(post);
  }

  async update(id: string, userId: string, dto: UpdatePostDto): Promise<Post> {
    const post = await this.findOneOrFail(id);
    if (post.authorId !== userId) throw new ForbiddenException();
    Object.assign(post, dto);
    return this.postsRepo.save(post);
  }

  async remove(id: string, userId: string): Promise<void> {
    const post = await this.findOneOrFail(id);
    if (post.authorId !== userId) throw new ForbiddenException();
    await this.postsRepo.softRemove(post);
  }

  private async findOneOrFail(id: string): Promise<Post> {
    const post = await this.postsRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }
}
