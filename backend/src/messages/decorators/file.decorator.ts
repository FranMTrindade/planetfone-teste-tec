import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UploadedFileData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.file; // vem do Multer
  },
);
