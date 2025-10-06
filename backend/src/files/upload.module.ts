import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { UploadsService } from './upload.service';
import { UploadsController } from './upload.controller';

@Module({
  imports: [AuthModule],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
