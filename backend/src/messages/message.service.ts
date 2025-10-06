import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class MessagesService {
  private messages: any[] = [];
  private uploadPath = join(__dirname, '..', '..', 'uploads');

  create(userPayload: any, message: any) {
    const { content, type = 'text', fileId } = message;

    if (!content || typeof content !== 'string') {
      throw new BadRequestException('Campo "content" é obrigatório');
    }

    if (type !== 'text') {
      if (!fileId) {
        throw new BadRequestException(
          'O campo "fileId" é obrigatório para mensagens de arquivo',
        );
      }

      const metaPath = join(this.uploadPath, `${fileId}.json`);
      if (!fs.existsSync(metaPath)) {
        throw new BadRequestException(`Metadados do arquivo não encontrados (${fileId})`);
      }

      const metadata = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

    
      if (metadata.userId !== userPayload.sub) {
        throw new ForbiddenException('Você não tem permissão para usar este arquivo');
      }


      const filePath = join(this.uploadPath, metadata.filename);
      if (!fs.existsSync(filePath)) {
        throw new BadRequestException(`Arquivo físico não encontrado: ${metadata.filename}`);
      }


      message.content = metadata.url;
    }


    const newMessage = {
      id: uuidv4(),
      content: message.content,
      sender: userPayload.name,
      userId: userPayload.sub,
      type,
      fileId: message.fileId || null,
      timestamp: message.timestamp || new Date().toISOString(),
    };

    this.messages.push(newMessage);
    return newMessage;
  }

  findAllForUser(userId: string) {
    return this.messages
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      )
      .map((msg) => ({
        ...msg,
        isMine: msg.userId === userId,
      }));
  }
}
