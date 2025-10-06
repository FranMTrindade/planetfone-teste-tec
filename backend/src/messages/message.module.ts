import { Module } from '@nestjs/common';
import { MessagesService } from './message.service';
import { AuthModule } from 'src/auth/auth.module';
import { MessagesController } from './message.controller';


@Module({
    imports: [AuthModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
