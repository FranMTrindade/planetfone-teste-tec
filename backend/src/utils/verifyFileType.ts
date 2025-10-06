import { BadRequestException } from '@nestjs/common';
import { allowedMimes } from './allowedMimes';

export function fileFilter(req: any, file: any, cb: any) {
  if (!allowedMimes.includes(file.mimetype)) {
    return cb(
      new BadRequestException(
        `Tipo de arquivo não suportado: ${file.mimetype}`,
      ),
      false,
    );
  }
  cb(null, true);
}
