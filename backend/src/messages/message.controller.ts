import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MessagesService } from './message.service';
import { AuthGuard } from '../auth/auth.guard'; 

@Controller('messages')
@UseGuards(AuthGuard) 
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Req() req, @Body() body: any) {
    const user = req.user; 
    return this.messagesService.create(user, body);
  }

  @Get()
  findAll(@Req() req) {
    const user = req.user; 
    return this.messagesService.findAllForUser(user.sub);
  }
}
