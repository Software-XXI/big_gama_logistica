import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { RepositoriesModule } from '@/common/providers/repositories.module';

@Module({
  imports: [
    RepositoriesModule,
    MulterModule.register({
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Solo imágenes permitidas'), false);
        }
      },
    }),
  ],
  controllers: [PhotosController],
  providers: [PhotosService],
  exports: [PhotosService],
})
export class PhotosModule {}