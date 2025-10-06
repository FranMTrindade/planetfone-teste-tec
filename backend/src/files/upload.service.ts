import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { resolveFileType } from 'src/utils/resolveTypes';
import { uploadPath } from 'src/utils/uploadPath';



@Injectable()
export class UploadsService {
  saveUserFile(user: any, file: any) {

    const type = resolveFileType(file.mimetype);
    const id = file.filename;

    const metadata = {
      id,
      userId: user.sub,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      type,
      url: `${process.env.APP_URL}/uploads/${file.filename}`,
    };

    fs.writeFileSync(
      join(uploadPath, `${file.filename}.json`),
      JSON.stringify(metadata, null, 2),
    );

    return metadata;
  }

  listFilesByUser(userId: string) {
    const files = fs.readdirSync(uploadPath);
    return files
      .filter((f) => f.endsWith('.json')) 
      .map((metaFile) => {
        const meta = JSON.parse(
          fs.readFileSync(join(uploadPath, metaFile), 'utf8'),
        );
        return meta;
      })
      .filter((m) => m.userId === userId); 
  }

   async deleteUserFile(user: any, fileId: string): Promise<boolean> {
    const metaPath = join(uploadPath, `${fileId}.json`);
    const filePath = join(uploadPath, fileId);

    if (!fs.existsSync(metaPath)) return false;

    const metadata = JSON.parse(fs.readFileSync(metaPath, 'utf8'));


    if (metadata.userId !== user.sub) {
      throw new ForbiddenException('Você não tem permissão para deletar este arquivo');
    }


    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    fs.unlinkSync(metaPath);

    return true;
  }
}
