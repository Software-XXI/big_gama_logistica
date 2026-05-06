import { Module } from '@nestjs/common';
import { ProductRepository } from './repositories/product.repository';
import { ReportRepository } from './repositories/report.repository';
import { UserRepository } from './repositories/user.repository';
import { PhotoRepository } from './repositories/photo.repository';

@Module({
  providers: [
    ProductRepository,
    ReportRepository,
    UserRepository,
    PhotoRepository,
  ],
  exports: [
    ProductRepository,
    ReportRepository,
    UserRepository,
    PhotoRepository,
  ],
})
export class RepositoriesModule {}