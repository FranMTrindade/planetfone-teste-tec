
import {  join } from 'path';
import * as fs from 'fs';

export const uploadPath = join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

