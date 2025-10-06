import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

export const storage = diskStorage({
  destination: (req, file, cb) => {
    try {
      const uploadPath = join(__dirname, '..', '..', 'uploads');

      // Garante que a pasta existe
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    } catch (error) {
      console.error('❌ Erro ao definir destino do upload:', error);
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    try {
      const uniqueName = `${Date.now()}-${Math.round(
        Math.random() * 1e9,
      )}${extname(file.originalname)}`;

      cb(null, uniqueName);
    } catch (error) {
      console.error('❌ Erro ao gerar nome do arquivo:', error);
      cb(error, null);
    }
  },
});
