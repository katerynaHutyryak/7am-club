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
import { BubblesService } from './bubbles.service';
import { JwtPayload } from '../auth/auth.guard';
import { CreateBubbleDto } from './dto/create-bubble.dto';
import { UpdateBubbleDto } from './dto/update-bubble.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { Bubble } from './entities/bubble.entity';
import { Message } from './entities/message.entity';

@Controller('bubbles')
export class BubblesController {
  constructor(private readonly bubblesService: BubblesService) {}

  @Get()
  findAll(@Request() req: { user: JwtPayload }): Promise<Bubble[]> {
    return this.bubblesService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: { user: JwtPayload },
  ): Promise<Bubble> {
    return this.bubblesService.findOne(id, req.user.sub);
  }

  @Post()
  create(
    @Request() req: { user: JwtPayload },
    @Body() dto: CreateBubbleDto,
  ): Promise<Bubble> {
    return this.bubblesService.create(req.user.sub, dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Request() req: { user: JwtPayload },
    @Body() dto: UpdateBubbleDto,
  ): Promise<Bubble> {
    return this.bubblesService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string,
    @Request() req: { user: JwtPayload },
  ): Promise<void> {
    return this.bubblesService.remove(id, req.user.sub);
  }

  @Post(':id/join')
  join(
    @Param('id') id: string,
    @Request() req: { user: JwtPayload },
  ): Promise<Bubble> {
    return this.bubblesService.join(id, req.user.sub);
  }

  @Post(':id/invite')
  invite(
    @Param('id') id: string,
    @Request() req: { user: JwtPayload },
    @Body() dto: InviteMemberDto,
  ): Promise<Bubble> {
    return this.bubblesService.invite(id, req.user.sub, dto.email);
  }

  @Post(':id/messages')
  sendMessage(
    @Param('id') id: string,
    @Request() req: { user: JwtPayload },
    @Body() dto: SendMessageDto,
  ): Promise<Message> {
    return this.bubblesService.sendMessage(id, req.user.sub, dto.text);
  }

  @Patch(':id/messages/:messageId')
  updateMessage(
    @Param('id') id: string,
    @Param('messageId') messageId: string,
    @Request() req: { user: JwtPayload },
    @Body() dto: UpdateMessageDto,
  ): Promise<Message> {
    return this.bubblesService.updateMessage(
      id,
      messageId,
      req.user.sub,
      dto.text,
    );
  }

  @Delete(':id/messages/:messageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteMessage(
    @Param('id') id: string,
    @Param('messageId') messageId: string,
    @Request() req: { user: JwtPayload },
  ): Promise<void> {
    return this.bubblesService.deleteMessage(id, messageId, req.user.sub);
  }
}
