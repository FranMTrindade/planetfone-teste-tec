import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
  Delete,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './upload.service';
import { storage } from 'src/utils/storage';
import { fileFilter } from 'src/utils/verifyFileType';
import { AuthGuard } from '../auth/auth.guard'; 

@Controller('uploads')
@UseGuards(AuthGuard) 
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      limits: { fileSize: 10 * 1024 * 1024 }, // até 10MB
      fileFilter,
    }),
  )
  uploadFile(@Req() req, @UploadedFile() file: any) {
    const user = req.user; 
    return this.uploadsService.saveUserFile(user, file);
  }

  @Get()
  listFiles(@Req() req) {
    const user = req.user; 
    return this.uploadsService.listFilesByUser(user.sub);
  }

  @Delete(':id')
  async deleteFile(@Req() req, @Param('id') fileId: string) {
    const user = req.user;
    const deleted = await this.uploadsService.deleteUserFile(user, fileId);

    if (!deleted) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    return { message: 'Arquivo e metadados removidos com sucesso' };
  }
}
