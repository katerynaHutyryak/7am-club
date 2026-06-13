import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bubble } from './entities/bubble.entity';
import { Message } from './entities/message.entity';
import { Visibility } from './enums/visibility.enum';
import { CreateBubbleDto } from './dto/create-bubble.dto';
import { UpdateBubbleDto } from './dto/update-bubble.dto';
import { User } from '../users/user.entity';

@Injectable()
export class BubblesService {
  constructor(
    @InjectRepository(Bubble)
    private readonly bubblesRepo: Repository<Bubble>,
    @InjectRepository(Message)
    private readonly messagesRepo: Repository<Message>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async findAll(userId: string): Promise<Bubble[]> {
    return this.bubblesRepo
      .createQueryBuilder('bubble')
      .leftJoinAndSelect('bubble.members', 'member')
      .leftJoinAndSelect('bubble.creator', 'creator')
      .where('bubble.visibility = :public', { public: Visibility.Public })
      .orWhere('bubble.creatorId = :userId', { userId })
      .orWhere('member.id = :userId', { userId })
      .orderBy('bubble.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string, userId: string): Promise<Bubble> {
    const bubble = await this.bubblesRepo.findOne({
      where: { id },
      relations: ['members', 'creator', 'messages', 'messages.sender'],
      order: { messages: { createdAt: 'ASC' } },
    });

    if (!bubble) throw new NotFoundException('Bubble not found');

    if (
      bubble.visibility === Visibility.Private &&
      bubble.creatorId !== userId &&
      !bubble.members.some((m) => m.id === userId)
    ) {
      throw new ForbiddenException();
    }

    return bubble;
  }

  async create(userId: string, dto: CreateBubbleDto): Promise<Bubble> {
    const user = await this.usersRepo.findOneOrFail({ where: { id: userId } });

    const bubble = this.bubblesRepo.create({
      name: dto.name,
      topic: dto.topic,
      colorIndex: dto.colorIndex ?? 0,
      visibility: dto.visibility,
      invitedEmails: dto.invitedEmails ?? [],
      creatorId: userId,
      members: [user],
    });

    return this.bubblesRepo.save(bubble);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateBubbleDto,
  ): Promise<Bubble> {
    const bubble = await this.findOneOwned(id, userId);
    Object.assign(bubble, dto);
    return this.bubblesRepo.save(bubble);
  }

  async remove(id: string, userId: string): Promise<void> {
    const bubble = await this.findOneOwned(id, userId);
    await this.bubblesRepo.softRemove(bubble);
  }

  async join(id: string, userId: string): Promise<Bubble> {
    const bubble = await this.bubblesRepo.findOne({
      where: { id },
      relations: ['members'],
    });
    if (!bubble) throw new NotFoundException('Bubble not found');

    const alreadyMember = bubble.members.some((m) => m.id === userId);
    if (alreadyMember) return bubble;

    const user = await this.usersRepo.findOneOrFail({ where: { id: userId } });

    if (
      bubble.visibility === Visibility.Private &&
      !bubble.invitedEmails?.includes(user.email)
    ) {
      throw new ForbiddenException('You are not invited to this bubble');
    }

    bubble.members.push(user);
    return this.bubblesRepo.save(bubble);
  }

  async invite(id: string, userId: string, email: string): Promise<Bubble> {
    const bubble = await this.findOneOwned(id, userId);

    if (!bubble.invitedEmails) bubble.invitedEmails = [];
    if (!bubble.invitedEmails.includes(email)) {
      bubble.invitedEmails.push(email);
    }

    return this.bubblesRepo.save(bubble);
  }

  async sendMessage(
    bubbleId: string,
    senderId: string,
    text: string,
  ): Promise<Message> {
    await this.assertMember(bubbleId, senderId);

    const message = this.messagesRepo.create({ text, senderId, bubbleId });
    const saved = await this.messagesRepo.save(message);
    return this.messagesRepo.findOne({
      where: { id: saved.id },
      relations: ['sender'],
    }) as Promise<Message>;
  }

  async updateMessage(
    bubbleId: string,
    messageId: string,
    userId: string,
    text: string,
  ): Promise<Message> {
    const message = await this.findMessage(bubbleId, messageId);
    if (message.senderId !== userId) throw new ForbiddenException();

    message.text = text;
    message.edited = true;
    const saved = await this.messagesRepo.save(message);
    return this.messagesRepo.findOne({
      where: { id: saved.id },
      relations: ['sender'],
    }) as Promise<Message>;
  }

  async deleteMessage(
    bubbleId: string,
    messageId: string,
    userId: string,
  ): Promise<void> {
    const message = await this.findMessage(bubbleId, messageId);
    if (message.senderId !== userId) throw new ForbiddenException();
    await this.messagesRepo.softRemove(message);
  }

  private async findOneOwned(id: string, userId: string): Promise<Bubble> {
    const bubble = await this.bubblesRepo.findOne({
      where: { id, creatorId: userId },
      relations: ['members'],
    });
    if (!bubble) throw new NotFoundException('Bubble not found');
    return bubble;
  }

  private async findMessage(
    bubbleId: string,
    messageId: string,
  ): Promise<Message> {
    const message = await this.messagesRepo.findOne({
      where: { id: messageId, bubbleId },
    });
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }

  private async assertMember(bubbleId: string, userId: string): Promise<void> {
    const bubble = await this.bubblesRepo.findOne({
      where: { id: bubbleId },
      relations: ['members'],
    });
    if (!bubble) throw new NotFoundException('Bubble not found');

    const isMember = bubble.members.some((m) => m.id === userId);
    if (!isMember) throw new ForbiddenException('Join the bubble first');
  }
}
